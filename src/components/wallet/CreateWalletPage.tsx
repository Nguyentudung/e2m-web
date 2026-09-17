import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getCurrencySymbol } from "@/utils/currency";
import { getAssetIcon } from "@/utils/assetIcons";
import type { AssetType } from "./CreateWalletTypes";

export type { AssetType } from "./CreateWalletTypes";
export type { SelectedAsset } from "./CreateWalletTypes";

export interface CreateWalletDraft {
  type: AssetType;
  assetId?: string;
  assetName?: string;
  assetIcon?: string;
  balance: string;
  currency: string;
  note: string;
  includeInTotal: boolean;
}

export interface CreateWalletResult {
  type: AssetType;
  assetId?: string;
  assetName?: string;
  assetIcon?: string;
  balance: number;
  currency: string;
  note: string;
  includeInTotal: boolean;
}

interface CreateWalletPageProps {
  draft: CreateWalletDraft;
  onChange: (patch: Partial<CreateWalletDraft>) => void;
  onBack: () => void;
  onSelectAssetType: () => void;
  onSelectCurrency: () => void;
  onSave: (data: CreateWalletResult) => void;
}

const TYPE_LABELS: Record<AssetType, string> = {
  cash: "Tiền mặt",
  bank: "Ngân hàng",
  ewallet: "Ví điện tử",
  card: "Thẻ",
};

function CreateWalletPage({
  draft,
  onChange,
  onBack,
  onSelectAssetType,
  onSelectCurrency,
  onSave,
}: CreateWalletPageProps) {
  const numericBalance = Number(draft.balance);
  const balanceValid =
    draft.balance !== "" &&
    Number.isFinite(numericBalance) &&
    numericBalance >= 0;
  const assetSelected = draft.type === "cash" || Boolean(draft.assetId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!balanceValid || !assetSelected) return;

    onSave({
      type: draft.type,
      assetId: draft.assetId,
      assetName: draft.assetName,
      assetIcon: draft.assetIcon,
      balance: numericBalance,
      currency: draft.currency,
      note: draft.note.trim(),
      includeInTotal: draft.includeInTotal,
    });
  };

  const assetIcon = getAssetIcon(draft.type, draft.assetIcon);

  return (
    <section className="flex h-full flex-col bg-background">
      {/* ================= HEADER ================= */}
      <header className="relative flex shrink-0 items-center px-4 pt-4 pb-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Quay lại"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface transition active:scale-95"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={2} />
        </button>
        <h1 className="pointer-events-none absolute inset-x-0 text-center text-lg font-bold">
          Tạo Tài Khoản
        </h1>
      </header>

      {/* ================= FORM ================= */}
      <form
        id="create-wallet-form"
        onSubmit={handleSubmit}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4"
      >
        <div className="space-y-2">
          {/* LOẠI TÀI KHOẢN */}
          <button
            type="button"
            onClick={onSelectAssetType}
            className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-surface px-4 text-left"
          >
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-secondary">
              {assetIcon ? (
                <img src={assetIcon} alt="" className="size-7 rounded-md object-contain" />
              ) : (
                <HugeiconsIcon icon={Wallet01Icon} size={20} strokeWidth={1.8} />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-text-secondary">Loại tài khoản</span>
              <span className="block truncate font-semibold">
                {draft.assetName
                  ? `${TYPE_LABELS[draft.type]} · ${draft.assetName}`
                  : TYPE_LABELS[draft.type]}
              </span>
            </span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              className="shrink-0 text-text-tertiary"
            />
          </button>

          {/* SỐ DƯ HIỆN TẠI */}
          <div className="flex min-h-16 items-center gap-3 rounded-2xl bg-surface px-4">
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-text-secondary">Số dư hiện tại</span>
              <input
                value={draft.balance}
                onChange={(event) =>
                  onChange({ balance: event.target.value.replace(/[^\d.]/g, "") })
                }
                inputMode="decimal"
                placeholder="0"
                aria-label="Số dư hiện tại"
                className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-text-disabled"
              />
            </span>
            <span className="shrink-0 text-sm font-semibold text-text-secondary">
              {draft.currency}
            </span>
          </div>

          {/* TIỀN TỆ */}
          <button
            type="button"
            onClick={onSelectCurrency}
            className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-surface px-4 text-left"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-sm font-bold">
              {getCurrencySymbol(draft.currency)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-text-secondary">Tiền tệ</span>
              <span className="block truncate font-semibold">{draft.currency}</span>
            </span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              className="shrink-0 text-text-tertiary"
            />
          </button>

          {/* GHI CHÚ */}
          <div className="flex min-h-16 items-center gap-3 rounded-2xl bg-surface px-4">
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-text-secondary">Ghi chú</span>
              <input
                value={draft.note}
                onChange={(event) => onChange({ note: event.target.value })}
                placeholder="Thêm thông tin để dễ nhận biết..."
                aria-label="Ghi chú"
                className="w-full bg-transparent text-sm outline-none placeholder:text-text-disabled"
              />
            </span>
          </div>

          {/* ĐÃ BAO GỒM TRONG TỔNG TÀI SẢN */}
          <div className="flex min-h-16 items-center gap-3 rounded-2xl bg-surface px-4">
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">
                Đã bao gồm trong tổng tài sản
              </span>
              <span className="block text-xs text-text-secondary">
                Bỏ chọn nếu đây là khoản vay hoặc thẻ tín dụng
              </span>
            </span>
            <Switch
              checked={draft.includeInTotal}
              onCheckedChange={(checked) => onChange({ includeInTotal: checked })}
              aria-label="Đã bao gồm trong tổng tài sản"
            />
          </div>
        </div>
      </form>

      {/* ================= ACTION ================= */}
      <div className="shrink-0 bg-background px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          form="create-wallet-form"
          disabled={!balanceValid || !assetSelected}
          className="h-12 w-full rounded-full font-bold"
        >
          Lưu
        </Button>
      </div>
    </section>
  );
}

export default CreateWalletPage;
