import { useState } from "react";
import profile from "../assets/icons/profile.svg";
import { Button } from "@/components/ui/button";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <img
        src={profile}
        alt="Cá nhân"
        className="mb-4 h-80 w-80 object-contain"
      />
      <h1 className="mb-6 text-xl font-bold text-text-primary">
        Thông tin cá nhân chưa hoàn thiện
      </h1>
      <Button onClick={() => setIsEditing(true)} size="lg">
        Điền thêm thông tin cá nhân
      </Button>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 text-left">
            <h3 className="mb-4 text-lg font-bold text-text-primary">
              Cập nhật thông tin
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-secondary"
              >
                Hủy
              </button>
              <Button onClick={() => setIsEditing(false)}>Lưu thay đổi</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProfilePage;
