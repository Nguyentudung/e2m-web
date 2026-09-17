import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  FingerPrintIcon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PinInput } from "./PinInput";
import { createPinSecret, isValidPin } from "./pin";
import { registerBiometric, supportsBiometric } from "./biometric";
import { getSecuritySettings, saveSecuritySettings } from "./security";
import { useSecurity } from "./useSecurity";

type Step = "overview" | "setup" | "confirm" | "biometric" | "verify" | "new-pin" | "new-confirm";

interface SecurityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SecurityDialog({ open, onOpenChange }: SecurityDialogProps) {
  const { settings, refresh, unlockWithPin } = useSecurity();
  const [step, setStep] = useState<Step>("overview");
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
      setError("Không thể bật sinh trắc học. Bạn vẫn có thể sử dụng mã PIN e2m.");
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
        <DialogHeader>
          <DialogTitle>
            {isVerify ? "Xác thực để tiếp tục" : isConfirm ? "Xác nhận mã PIN" : "Thiết lập khóa bảo mật"}
          </DialogTitle>
          <DialogDescription>
            {isVerify
              ? "Nhập mã PIN e2m hiện tại."
              : isConfirm
                ? "Nhập lại mã PIN 6 chữ số của bạn."
                : "Tạo mã PIN 6 chữ số để bảo vệ e2m."}
          </DialogDescription>
        </DialogHeader>
        <PinInput value={pin} onChange={setPin} disabled={busy} />
        {error && <p className="text-center text-sm text-destructive">{error}</p>}
        <Button onClick={isVerify ? verifyCurrent : handleSetupPin} disabled={busy || pin.length !== 6} className="w-full">
          {busy ? "Đang xử lý..." : isVerify ? "Xác nhận" : isConfirm ? "Hoàn tất" : "Tiếp tục"}
        </Button>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        {step === "overview" && settings?.enabled ? (
          <>
            <DialogHeader>
              <DialogTitle>Khóa bảo mật</DialogTitle>
              <DialogDescription>Đã bật bảo vệ cho e2m.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm">
                <span className="font-medium">Sinh trắc học</span>
                <span className="text-text-secondary">{settings.biometricEnabled ? "Đã bật" : "Chưa bật"}</span>
              </div>
              {!settings.biometricEnabled && (
                <Button variant="outline" className="w-full justify-start gap-3" onClick={() => setStep("biometric")}>
                  <HugeiconsIcon icon={FingerPrintIcon} size={18} /> Bật sinh trắc học
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => { setPendingAction("change"); setStep("verify"); }}>
                <HugeiconsIcon icon={ShieldCheckIcon} size={18} /> Đổi mã PIN
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => { setPendingAction("disable"); setStep("verify"); }}>
                <HugeiconsIcon icon={ShieldCheckIcon} size={18} /> Tắt khóa bảo mật
              </Button>
            </div>
          </>
        ) : step === "biometric" ? (
          <>
            <DialogHeader>
              <DialogTitle>Bật sinh trắc học</DialogTitle>
              <DialogDescription>Sử dụng vân tay, khuôn mặt hoặc phương thức xác thực được thiết bị hỗ trợ để mở khóa e2m nhanh hơn.</DialogDescription>
            </DialogHeader>
            <HugeiconsIcon icon={FingerPrintIcon} size={48} className="mx-auto text-primary" />
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <Button onClick={handleBiometric} disabled={busy} className="w-full">Bật sinh trắc học</Button>
            <Button variant="ghost" onClick={() => { setStep("overview"); close(); }}>Để sau</Button>
          </>
        ) : step === "new-pin" ? (
          <>
            <DialogHeader>
              <DialogTitle>Đổi mã PIN</DialogTitle>
              <DialogDescription>Nhập mã PIN e2m mới gồm 6 chữ số.</DialogDescription>
            </DialogHeader>
            <PinInput value={newPin} onChange={setNewPin} disabled={busy} />
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <Button onClick={() => { if (!isValidPin(newPin)) { setError("Vui lòng nhập đủ 6 chữ số."); return; } setPin(""); setError(""); setStep("new-confirm"); }} disabled={newPin.length !== 6} className="w-full">Tiếp tục</Button>
          </>
        ) : step === "new-confirm" ? (
          <>
            <DialogHeader><DialogTitle>Xác nhận mã PIN mới</DialogTitle><DialogDescription>Nhập lại mã PIN mới của bạn.</DialogDescription></DialogHeader>
            <PinInput value={pin} onChange={setPin} disabled={busy} />
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <Button onClick={confirmPin} disabled={busy || pin.length !== 6} className="w-full">Cập nhật mã PIN</Button>
          </>
        ) : step === "verify" ? renderPinStep() : (
          <>
            {step === "confirm" || step === "setup" ? renderPinStep() : null}
          </>
        )}
        {step === "verify" && (
          <Button variant="ghost" onClick={() => setStep("overview")}><HugeiconsIcon icon={ArrowLeft01Icon} size={18} /> Quay lại</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
