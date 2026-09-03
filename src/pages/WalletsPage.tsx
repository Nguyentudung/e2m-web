import { useState } from "react";
import wallet from "../assets/icons/wallet.svg";
import { Button } from "@/components/ui/button";

function WalletsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <img
        src={wallet}
        alt="Ví tiền"
        className="mb-4 h-80 w-80 object-contain"
      />
      <h1 className="mb-6 text-xl font-bold text-text-primary">
        Chưa có ví hoặc thẻ nào
      </h1>
      <Button onClick={() => setShowCreateForm(true)} size="lg">
        + Tạo ví mới ngay
      </Button>

      {/* CREATE WALLET MODAL */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 text-left">
            <h3 className="mb-2 text-lg font-bold text-text-primary">
              Tạo ví mới
            </h3>
            <p className="mb-6 text-sm text-text-secondary">
              Nhập tên ví và số dư ban đầu.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-secondary"
              >
                Hủy
              </button>
              <Button onClick={() => setShowCreateForm(false)}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default WalletsPage;
