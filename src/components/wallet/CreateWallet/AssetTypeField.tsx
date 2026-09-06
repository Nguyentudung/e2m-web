import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building03Icon,
  CreditCardIcon,
  SmartPhone01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

import { Field, FieldLabel } from "@/components/ui/field";

import type { AssetType } from "../CreateWalletPage";

interface AssetTypeFieldProps {
  value: AssetType;
  onChange: (value: AssetType) => void;
}

const assetTypes = [
  {
    type: "cash" as const,
    label: "Tiền mặt",
    icon: Wallet01Icon,
  },
  {
    type: "bank" as const,
    label: "Ngân hàng",
    icon: Building03Icon,
  },
  {
    type: "ewallet" as const,
    label: "Ví điện tử",
    icon: SmartPhone01Icon,
  },
  {
    type: "card" as const,
    label: "Thẻ",
    icon: CreditCardIcon,
  },
];

function AssetTypeField({ value, onChange }: AssetTypeFieldProps) {
  return (
    <Field>
      <FieldLabel>Loại tài sản</FieldLabel>

      <div
        className="
          grid grid-cols-2 gap-2
          rounded-2xl
          border border-white/10
          bg-surface/70
          p-2
          sm:grid-cols-4
        "
      >
        {assetTypes.map((asset) => {
          const selected = value === asset.type;

          return (
            <button
              key={asset.type}
              type="button"
              onClick={() => onChange(asset.type)}
              className={`
                flex min-h-12
                items-center justify-center
                gap-2
                rounded-xl
                px-3
                text-xs font-semibold
                transition
                sm:min-h-14
                ${
                  selected
                    ? "bg-background text-text-primary"
                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                }
              `}
            >
              <HugeiconsIcon
                icon={asset.icon}
                size={19}
                strokeWidth={selected ? 2.2 : 1.8}
              />

              <span>{asset.label}</span>
            </button>
          );
        })}
      </div>
    </Field>
  );
}

export default AssetTypeField;
