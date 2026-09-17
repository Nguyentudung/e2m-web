import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FingerPrintIcon, ShieldCheckIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { PinInput } from "./PinInput";
import { useSecurity } from "./useSecurity";

export function LockScreen() {
  const { settings, unlockWithPin, unlockWithBiometric } = useSecurity();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleBiometric = async () => {
    setBusy(true);
    setError("");
    try {
      if (!(await unlockWithBiometric())) {
        setError("Xác thực không thành công. Bạn có thể mở khóa bằng mã PIN.");
      }
    } catch {
      setError("Xác thực không thành công. Bạn có thể mở khóa bằng mã PIN.");
    } finally {
      setBusy(false);
    }
  };

  const handlePin = async () => {
    setBusy(true);
    setError("");
    try {
      if (!(await unlockWithPin(pin))) {
        setError("Mã PIN không đúng. Vui lòng thử lại.");
        setPin("");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center bg-background px-5 py-8 text-text-primary">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-surface text-primary">
          <HugeiconsIcon icon={ShieldCheckIcon} size={34} strokeWidth={2} />
        </div>
        <div className="mt-6 space-y-2">
          <h1 className="text-xl font-bold">Mở khóa ứng dụng</h1>
          <p className="text-sm leading-6 text-text-secondary">Xác thực để tiếp tục quản lý tài chính của bạn.</p>
        </div>

        {!showPin && settings?.biometricEnabled ? (
          <div className="mt-6 space-y-3">
            <Button className="h-11 w-full gap-2 rounded-full" onClick={handleBiometric} disabled={busy}>
              <HugeiconsIcon icon={FingerPrintIcon} size={19} />
              {busy ? "Đang xác thực..." : "Mở khóa bằng sinh trắc học"}
            </Button>
            <Button variant="ghost" className="h-11 w-full rounded-full" onClick={() => setShowPin(true)}>Mở khóa bằng PIN</Button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium">Nhập mã PIN</p>
            <PinInput value={pin} onChange={setPin} disabled={busy} />
            <p className="min-h-5 text-sm text-destructive">{error}</p>
            <Button className="h-11 w-full rounded-full" onClick={handlePin} disabled={busy || pin.length !== 6}>
              {busy ? "Đang mở khóa..." : "Mở khóa"}
            </Button>
            {settings?.biometricEnabled && (
              <Button variant="ghost" className="h-11 w-full rounded-full" onClick={() => { setShowPin(false); setError(""); }}>Quay lại sinh trắc học</Button>
            )}
          </div>
        )}
        {!showPin && error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
