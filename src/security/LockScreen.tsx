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
        setError("Xác thực không thành công. Bạn có thể mở khóa bằng mã PIN e2m.");
      }
    } catch {
      setError("Xác thực không thành công. Bạn có thể mở khóa bằng mã PIN e2m.");
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
    <div className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center bg-background px-4 text-text-primary">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface text-primary">
          <HugeiconsIcon icon={ShieldCheckIcon} size={34} strokeWidth={2} />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold">e2m đã được khóa</h1>
          <p className="text-sm text-text-secondary">Ứng dụng đang được khóa để bảo vệ dữ liệu của bạn.</p>
        </div>

        {!showPin && settings?.biometricEnabled ? (
          <div className="space-y-3">
            <Button className="w-full gap-2" onClick={handleBiometric} disabled={busy}>
              <HugeiconsIcon icon={FingerPrintIcon} size={19} />
              {busy ? "Đang xác thực..." : "Mở khóa bằng sinh trắc học"}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowPin(true)}>Mở khóa bằng PIN</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium">Nhập mã PIN e2m</p>
            <PinInput value={pin} onChange={setPin} disabled={busy} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" onClick={handlePin} disabled={busy || pin.length !== 6}>
              {busy ? "Đang mở khóa..." : "Mở khóa"}
            </Button>
            {settings?.biometricEnabled && (
              <Button variant="ghost" className="w-full" onClick={() => { setShowPin(false); setError(""); }}>Quay lại sinh trắc học</Button>
            )}
          </div>
        )}
        {!showPin && error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
