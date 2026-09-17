import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FingerPrintIcon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { PinInput } from "./PinInput";
import { createPinSecret, isValidPin } from "./pin";
import { registerBiometric, supportsBiometric } from "./biometric";
import {
  DEFAULT_AUTO_LOCK_MINUTES,
  getSecuritySettings,
  saveSecuritySettings,
} from "./security";
import { useSecurity } from "./useSecurity";

type Step = "overview" | "setup" | "confirm" | "biometric" | "timeout" | "verify" | "new-pin" | "new-confirm";
export type SecurityEntryPoint = "overview" | "biometric" | "timeout";

interface SecurityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: SecurityEntryPoint;
}

export function SecurityDialog({ open, onOpenChange, initialStep = "overview" }: SecurityDialogProps) {
  const { settings, refresh, unlockWithPin } = useSecurity();
  const [step, setStep] = useState<Step>(() =>
    settings?.enabled ? initialStep : initialStep === "overview" ? "setup" : "setup",
  );
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingAction, setPendingAction] = useState<"change" | "disable" | null>(null);

  const close = () => onOpenChange(false);

  const confirmPin = async () => {
    if (!isValidPin(pin)) {
      setError("Vui lòng nhập đủ 6 chữ số.");
      return;
    }
    if (pin !== newPin && step === "confirm") {
      setError("Mã PIN không khớp. Vui lòng nhập lại.");
      setPin("");
      return;
    }

    setBusy(true);
    try {
      const secret = await createPinSecret(step === "new-confirm" ? newPin : newPin);
      const current = getSecuritySettings();
      saveSecuritySettings({
        version: 1,
        enabled: true,
        biometricEnabled: current?.biometricEnabled ?? false,
        credentialId: current?.credentialId,
        ...secret,
      });
      refresh();
      setPin("");
      setNewPin("");
      setError("");
      setStep("biometric");
    } finally {
      setBusy(false);
    }
  };

  const handleSetupPin = async () => {
    if (step === "setup") {
      if (!isValidPin(pin)) {
        setError("Vui lòng nhập đủ 6 chữ số.");
        return;
      }
      setNewPin(pin);
      setPin("");
      setError("");
      setStep("confirm");
      return;
    }
    await confirmPin();
  };

  const handleBiometric = async () => {
    setError("");
    if (!supportsBiometric()) {
      setError("Thiết bị hoặc trình duyệt này chưa hỗ trợ xác thực sinh trắc học.");
      return;
    }
    setBusy(true);
    try {
      const credentialId = await registerBiometric();
      const current = getSecuritySettings();
      if (!current) return;
      saveSecuritySettings({ ...current, biometricEnabled: true, credentialId });
      refresh();
      setStep("overview");
    } catch {
      setError("Không thể bật sinh trắc học. Bạn vẫn có thể sử dụng mã PIN.");
    } finally {
      setBusy(false);
    }
  };

  const verifyCurrent = async () => {
    if (step === "verify") {
      setBusy(true);
      try {
        if (!(await unlockWithPin(pin))) {
          setError("Mã PIN không đúng. Vui lòng thử lại.");
          setPin("");
          return;
        }
        setPin("");
        setError("");
        if (pendingAction === "change") {
          setStep("new-pin");
        } else {
          await disableSecurity();
        }
      } finally {
        setBusy(false);
      }
    }
  };

  const disableSecurity = async () => {
    const current = getSecuritySettings();
    if (!current) return;
    saveSecuritySettings({ ...current, enabled: false, biometricEnabled: false, credentialId: undefined });
    refresh();
    close();
  };

  const renderPinStep = () => {
    const isConfirm = step === "confirm" || step === "new-confirm";
    const isVerify = step === "verify";
    return (
      <>
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-2.5">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-bold text-text-primary">
              {isVerify ? "Xác thực để tiếp tục" : isConfirm ? "Xác nhận mã PIN" : "Tạo mã PIN"}
            </h2>
            <p className="text-sm leading-6 text-text-secondary">
              {isVerify
                ? "Nhập mã PIN hiện tại."
                : isConfirm
                  ? "Nhập lại 6 chữ số để xác nhận mã PIN."
                  : "Tạo mã PIN 6 chữ số để bảo vệ dữ liệu của bạn."}
            </p>
          </div>
          <PinInput value={pin} onChange={setPin} disabled={busy} />
          <div className="min-h-4 text-center text-sm text-destructive">
            {error}
          </div>
          <Button
            onClick={isVerify ? verifyCurrent : handleSetupPin}
            disabled={busy || pin.length !== 6}
            className="h-11 w-full rounded-full"
          >
            {busy ? "Đang xử lý..." : isVerify ? "Xác nhận" : isConfirm ? "Hoàn tất" : "Tiếp tục"}
          </Button>
          {isVerify && (
            <Button variant="outline" onClick={() => setStep("overview")} className="h-11 w-full rounded-full">
              Quay lại
            </Button>
          )}
        </div>
      </>
    );
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerContent className="max-h-[min(88dvh,44rem)] rounded-t-[28px] !border-0 !border-transparent bg-background sm:mx-auto sm:max-w-lg">
        <div className="mx-auto flex w-full max-w-lg min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-7">
        {step === "overview" && settings?.enabled ? (
          <>
            <DrawerHeader className="p-0 text-left">
              <DrawerTitle>Bảo mật</DrawerTitle>
              <DrawerDescription>Quản lý các tùy chọn bảo vệ ứng dụng.</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm">
                <span className="font-medium">Mã PIN</span>
                <span className="text-text-secondary">Đã bật</span>
              </div>
              <Button variant="outline" className="h-11 w-full justify-start gap-3 rounded-full" onClick={() => { setPendingAction("change"); setStep("verify"); }}>
                <HugeiconsIcon icon={ShieldCheckIcon} size={18} /> Đổi mã PIN
              </Button>
              <Button variant="outline" className="h-11 w-full justify-start gap-3 rounded-full" onClick={() => { setPendingAction("disable"); setStep("verify"); }}>
                <HugeiconsIcon icon={ShieldCheckIcon} size={18} /> Tắt khóa bảo mật
              </Button>
            </div>
          </>
        ) : step === "timeout" ? (
          <>
            <DrawerHeader className="p-0 text-left">
              <DrawerTitle>Thời gian tự khóa</DrawerTitle>
              <DrawerDescription>Chọn thời gian ứng dụng tự khóa khi không sử dụng.</DrawerDescription>
            </DrawerHeader>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[1, 5, 15, 30].map((minutes) => (
                <Button
                  key={minutes}
                  variant={settings?.autoLockMinutes === minutes || (!settings?.autoLockMinutes && minutes === DEFAULT_AUTO_LOCK_MINUTES) ? "default" : "outline"}
                  className="h-11 rounded-full"
                  onClick={() => {
                    const current = getSecuritySettings();
                    if (!current) return;
                    saveSecuritySettings({ ...current, autoLockMinutes: minutes });
                    refresh();
                    setStep("overview");
                  }}
                >
                  {minutes} phút
                </Button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setStep("overview")} className="mt-3 h-11 w-full rounded-full">
              Quay lại
            </Button>
          </>
        ) : step === "biometric" ? (
          <>
            <DrawerHeader className="p-0 text-left">
              <DrawerTitle>Bật sinh trắc học</DrawerTitle>
              <DrawerDescription>Sử dụng vân tay, khuôn mặt hoặc phương thức xác thực được thiết bị hỗ trợ để mở khóa nhanh hơn.</DrawerDescription>
            </DrawerHeader>
            <HugeiconsIcon icon={FingerPrintIcon} size={48} className="mx-auto mt-5 text-primary" />
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <div className="mt-5 space-y-2">
              <Button onClick={handleBiometric} disabled={busy} className="h-11 w-full rounded-full">Bật sinh trắc học</Button>
              <Button variant="ghost" className="h-11 w-full rounded-full" onClick={() => { setStep("overview"); close(); }}>Để sau</Button>
            </div>
          </>
        ) : step === "new-pin" ? (
          <>
            <DrawerHeader className="p-0 text-left">
              <DrawerTitle>Đổi mã PIN</DrawerTitle>
              <DrawerDescription>Nhập mã PIN mới gồm 6 chữ số.</DrawerDescription>
            </DrawerHeader>
            <PinInput value={newPin} onChange={setNewPin} disabled={busy} />
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <Button onClick={() => { if (!isValidPin(newPin)) { setError("Vui lòng nhập đủ 6 chữ số."); return; } setPin(""); setError(""); setStep("new-confirm"); }} disabled={newPin.length !== 6} className="w-full">Tiếp tục</Button>
          </>
        ) : step === "new-confirm" ? (
          <>
            <DrawerHeader className="p-0 text-left"><DrawerTitle>Xác nhận mã PIN mới</DrawerTitle><DrawerDescription>Nhập lại mã PIN mới của bạn.</DrawerDescription></DrawerHeader>
            <PinInput value={pin} onChange={setPin} disabled={busy} />
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <Button onClick={confirmPin} disabled={busy || pin.length !== 6} className="w-full">Cập nhật mã PIN</Button>
          </>
        ) : step === "verify" ? renderPinStep() : (
          <>
            {step === "confirm" || step === "setup" ? renderPinStep() : null}
          </>
        )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
