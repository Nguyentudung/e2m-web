import { useState } from "react";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface ProfileEditModalProps {
  open: boolean;
  nickname: string;
  onClose: () => void;
  onSave: (nickname: string) => void;
}

function ProfileEditModal({
  open,
  nickname: currentNickname,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  const [nickname, setNickname] = useState(currentNickname || "ntd");

  if (!open) return null;

  const handleSave = () => {
    const value = nickname.trim();
    if (!value) return;
    onSave(value);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop with backdrop-blur */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-t-[28px] sm:rounded-[26px] bg-surface p-6 shadow-2xl text-text-primary border border-border/80">
        {/* Mobile handle indicator */}
        <div className="sm:hidden -mt-2 mb-3 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-text-tertiary/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1D2129] text-white">
              <HugeiconsIcon icon={UserIcon} size={13} strokeWidth={2} />
            </div>
            <span className="text-base font-bold text-text-primary">Tài khoản</span>
          </div>

          <div className="w-8" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            Chọn tên người dùng của bạn
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed px-4">
            Tên người dùng của bạn sẽ được hiển thị trên trang cá nhân và các báo cáo.
          </p>
        </div>

        {/* Clean Username Input Box */}
        <div className="flex items-center rounded-2xl border border-border/80 bg-background overflow-hidden p-1.5 focus-within:ring-2 focus-within:ring-primary-500/40 focus-within:border-primary-500">
          {/* Left Icon Badge */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-text-secondary">
            <HugeiconsIcon icon={UserIcon} size={20} strokeWidth={1.8} />
          </div>

          {/* Text Input */}
          <div className="flex-1 px-3">
            <label className="block text-[10px] font-medium text-text-tertiary">
              Tên người dùng
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Nhập tên người dùng..."
              maxLength={30}
              autoFocus
              className="w-full bg-transparent text-sm font-semibold text-text-primary focus:outline-none placeholder:text-text-disabled"
            />
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="mt-8">
          <Button
            onClick={handleSave}
            className="w-full rounded-full bg-[#1D2129] dark:bg-white text-white dark:text-black hover:bg-[#1D2129]/90 dark:hover:bg-white/90 py-3.5 text-sm font-semibold shadow-md"
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ProfileEditModal;
