import { useState } from "react";
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
  const [nickname, setNickname] = useState(currentNickname);

  if (!open) return null;

  const handleSave = () => {
    const value = nickname.trim();

    if (!value) return;

    onSave(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 text-left">
        <h3 className="mb-4 text-lg font-bold text-text-primary">
          Cập nhật biệt danh
        </h3>

        <div>
          <label className="mb-1 block text-xs font-semibold text-text-secondary">
            Biệt danh
          </label>

          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nhập biệt danh..."
            maxLength={30}
            autoFocus
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:outline-none"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-secondary"
          >
            Hủy
          </button>

          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditModal;
