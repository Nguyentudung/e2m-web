import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Download01Icon,
  Upload01Icon,
  Delete02Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface DataBackupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DataBackupModal({ open, onClose }: DataBackupModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!open) return null;

  // Export LocalStorage data to JSON file
  const handleExportData = () => {
    try {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key) || "";
        }
      }

      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const dateStr = new Date().toISOString().slice(0, 10);
      const a = document.createElement("a");
      a.href = url;
      a.download = `montra-backup-${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: "success",
        text: "Xuất dữ liệu thành công! Tệp sao lưu đã được tải về.",
      });
    } catch {
      setStatusMessage({
        type: "error",
        text: "Có lỗi xảy ra khi xuất dữ liệu.",
      });
    }
  };

  // Import JSON backup file to LocalStorage
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (typeof parsed !== "object" || parsed === null) {
          throw new Error("Invalid format");
        }

        Object.keys(parsed).forEach((key) => {
          localStorage.setItem(key, parsed[key]);
        });

        setStatusMessage({
          type: "success",
          text: "Nhập dữ liệu thành công! Đang tải lại...",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch {
        setStatusMessage({
          type: "error",
          text: "Tệp sao lưu không hợp lệ. Vui lòng chọn đúng tệp JSON từ Montra.",
        });
      }
    };
    reader.readAsText(file);
  };

  // Clear all app data from LocalStorage
  const handleClearAllData = () => {
    localStorage.clear();
    setStatusMessage({
      type: "success",
      text: "Đã xóa toàn bộ dữ liệu thành công. Đang tải lại...",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl text-text-primary border border-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h2 className="text-base font-bold text-text-primary">
            Quản lý dữ liệu
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`mb-4 flex items-center gap-2.5 rounded-xl p-3 text-xs font-medium ${
              statusMessage.type === "success"
                ? "bg-green-base-100 text-green-base-400 dark:bg-green-base-400/20"
                : "bg-red-base-100 text-red-base-400 dark:bg-red-base-400/20"
            }`}
          >
            <HugeiconsIcon
              icon={
                statusMessage.type === "success"
                  ? CheckmarkCircle01Icon
                  : AlertCircleIcon
              }
              size={16}
              strokeWidth={2}
              className="shrink-0"
            />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Action Options */}
        <div className="space-y-3">
          {/* Export */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Xuất tệp sao lưu
              </p>
              <p className="text-xs text-text-secondary">
                Tải về tệp JSON chứa toàn bộ dữ liệu giao dịch & ví
              </p>
            </div>
            <Button
              onClick={handleExportData}
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
            >
              <HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={2} />
              <span>Xuất</span>
            </Button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Nhập tệp sao lưu
              </p>
              <p className="text-xs text-text-secondary">
                Khôi phục dữ liệu từ tệp JSON đã lưu trước đó
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
            >
              <HugeiconsIcon icon={Upload01Icon} size={16} strokeWidth={2} />
              <span>Nhập</span>
            </Button>
          </div>

          {/* Clear Data */}
          <div className="rounded-xl border border-red-base-200/40 bg-red-base-100/20 p-4 dark:bg-red-base-400/10">
            {!showClearConfirm ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-base-400">
                    Xóa toàn bộ dữ liệu
                  </p>
                  <p className="text-xs text-text-secondary">
                    Xóa sạch mọi ví tiền và lịch sử giao dịch
                  </p>
                </div>
                <Button
                  onClick={() => setShowClearConfirm(true)}
                  variant="destructive"
                  size="sm"
                  className="shrink-0 gap-1.5"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} />
                  <span>Xóa</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-red-base-400">
                  Bạn có chắc chắn muốn xóa toàn bộ dữ liệu? Hành động này không thể hoàn tác!
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setShowClearConfirm(false)}
                    variant="outline"
                    size="sm"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleClearAllData}
                    variant="destructive"
                    size="sm"
                  >
                    Xác nhận xóa
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose} variant="secondary" className="w-full">
            Đóng
          </Button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
}
