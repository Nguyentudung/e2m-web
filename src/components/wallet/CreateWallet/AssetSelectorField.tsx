import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building03Icon,
  CreditCardIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";

import { Field, FieldLabel } from "@/components/ui/field";

import type { AssetType, SelectedAsset } from "../CreateWalletPage";

interface AssetSelectorFieldProps {
  type: AssetType;
  selectedAsset: SelectedAsset | null;
  selectedAssetIcon?: string;
  onSelect: () => void;
}

function AssetSelectorField({
  type,
  selectedAsset,
  selectedAssetIcon,
  onSelect,
}: AssetSelectorFieldProps) {
  const label =
    type === "bank"
      ? "Ngân hàng"
      : type === "ewallet"
        ? "Ví điện tử"
        : "Loại thẻ";

  const icon =
    type === "bank"
      ? Building03Icon
      : type === "ewallet"
        ? SmartPhone01Icon
        : CreditCardIcon;

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>

      <button
        type="button"
        onClick={onSelect}
        className="
          flex min-h-16 w-full
          items-center gap-3
          rounded-xl
          border border-white/10
          bg-surface/90
          px-3 py-2.5
          text-left
          transition
          hover:bg-surface
          active:scale-[0.99]
        "
      >
        <div
          className="
            flex size-11 shrink-0
            items-center justify-center
            overflow-hidden
            rounded-xl
            bg-background
          "
        >
          {selectedAssetIcon ? (
            <img
              src={selectedAssetIcon}
              alt={selectedAsset?.name ?? ""}
              className="size-7 object-contain"
            />
          ) : (
            <HugeiconsIcon
              icon={icon}
              size={21}
              strokeWidth={1.8}
              className="text-text-secondary"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">
            {selectedAsset?.name ?? `Chọn ${label.toLowerCase()}`}
          </p>

          <p className="mt-0.5 text-xs text-text-secondary">
            {selectedAsset ? "Nhấn để thay đổi" : "Nhấn để lựa chọn"}
          </p>
        </div>

        <span className="text-xs font-semibold text-text-secondary">
          {selectedAsset ? "Thay đổi" : "Chọn"}
        </span>
      </button>
    </Field>
  );
}

export default AssetSelectorField;
