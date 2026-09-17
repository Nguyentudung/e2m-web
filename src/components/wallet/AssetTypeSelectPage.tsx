import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Building03Icon,
  CreditCardIcon,
  SmartPhone01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import type { AssetType } from "./CreateWalletPage";

const assetTypes: {
  type: AssetType;
  label: string;
  description: string;
  icon: typeof Wallet01Icon;
}[] = [
  {
    type: "cash",
    label: "Tiền mặt",
    description: "Ví tiền, tiền mặt đang có",
    icon: Wallet01Icon,
  },
  {
    type: "bank",
    label: "Ngân hàng",
    description: "Tài khoản ngân hàng",
    icon: Building03Icon,
  },
  {
    type: "ewallet",
    label: "Ví điện tử",
    description: "MoMo, ZaloPay, ShopeePay...",
    icon: SmartPhone01Icon,
  },
  {
    type: "card",
    label: "Thẻ",
    description: "Thẻ tín dụng, thẻ ghi nợ",
    icon: CreditCardIcon,
  },
];

interface AssetTypeSelectPageProps {
  selected: AssetType;
  onBack: () => void;
  onSelect: (type: AssetType) => void;
}

function AssetTypeSelectPage({
  selected,
  onBack,
  onSelect,
}: AssetTypeSelectPageProps) {
  return (
    <section className="flex h-full flex-col bg-background">
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
          Loại Tài Khoản
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="space-y-2">
          {assetTypes.map((asset) => {
            const isSelected = selected === asset.type;
            return (
              <button
                key={asset.type}
                type="button"
                onClick={() => onSelect(asset.type)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-text-primary"
                }`}
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                    isSelected ? "bg-primary-400/40" : "bg-surface-secondary"
                  }`}
                >
                  <HugeiconsIcon icon={asset.icon} size={21} strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{asset.label}</span>
                  <span
                    className={`block truncate text-xs ${
                      isSelected ? "text-primary-foreground/75" : "text-text-secondary"
                    }`}
                  >
                    {asset.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AssetTypeSelectPage;
