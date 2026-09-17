import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft01Icon,
  Wallet01Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getWallets, type Wallet } from "@/types/wallets";
import { getAssetIcon } from "@/utils/assetIcons";
import { formatCurrency } from "@/utils/currency";
import type { TransactionDraft } from "@/pages/AddTransactionPage";

const TYPE_LABELS: Record<Wallet["type"], string> = {
  cash: "Tiền mặt",
  bank: "Ngân hàng",
  ewallet: "Ví điện tử",
  card: "Thẻ",
};

function SelectWalletPage() {
  const navigate = useNavigate();
  const state = useLocation().state as { draft?: TransactionDraft } | null;
  const draft = state?.draft;
  const wallets = useMemo(getWallets, []);

  const choose = (walletId: string) =>
    navigate("/add", {
      replace: true,
      state: {
        draft: {
          ...draft,
          type: draft?.type ?? "expense",
          amountText: draft?.amountText ?? "0",
          categoryId: draft?.categoryId ?? "",
          note: draft?.note ?? "",
          date: draft?.date ?? new Date().toISOString().slice(0, 10),
          time: draft?.time ?? "",
          walletId,
        },
      },
    });

  return (
    <section className="mx-auto min-h-[100dvh] w-full max-w-2xl px-4 pb-10 pt-5">
      <header className="relative mb-7 flex items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface transition active:scale-95"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
        </button>
        <h1 className="pointer-events-none absolute inset-x-0 text-center text-lg font-bold">
          Chọn tài khoản
        </h1>
      </header>

      {wallets.length ? (
        <div className="space-y-2">
          {wallets.map((wallet) => {
            const selected = wallet.id === draft?.walletId;
            const icon = getAssetIcon(wallet.type, wallet.assetIcon);
            return (
              <button
                key={wallet.id}
                type="button"
                onClick={() => choose(wallet.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-text-primary"
                }`}
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl ${
                    selected ? "bg-primary-400/40" : "bg-surface-secondary"
                  }`}
                >
                  {icon ? (
                    <img src={icon} alt="" className="size-7 rounded-md object-contain" />
                  ) : (
                    <HugeiconsIcon icon={Wallet01Icon} size={21} strokeWidth={1.8} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    {wallet.assetName ?? wallet.assetId ?? TYPE_LABELS[wallet.type]}
                  </span>
                  <span
                    className={`block text-xs ${
                      selected ? "text-primary-foreground/75" : "text-text-secondary"
                    }`}
                  >
                    {TYPE_LABELS[wallet.type]}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-surface p-8 text-center">
          <HugeiconsIcon
            icon={Wallet01Icon}
            size={40}
            strokeWidth={1.6}
            className="mx-auto text-text-tertiary"
          />
          <p className="mt-3 font-semibold">Chưa có tài khoản</p>
          <p className="mt-1 text-sm text-text-secondary">
            Tạo ví trước khi ghi giao dịch.
          </p>
          <button
            type="button"
            onClick={() => navigate("/wallets")}
            className="mt-5 inline-flex h-11 items-center gap-1.5 rounded-full bg-primary-accent px-5 text-sm font-semibold text-primary-accent-text"
          >
            <HugeiconsIcon icon={Add01Icon} size={18} strokeWidth={2.2} />
            Tạo ví
          </button>
        </div>
      )}
    </section>
  );
}
export default SelectWalletPage;
