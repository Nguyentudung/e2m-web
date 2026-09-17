import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { currencies } from "@/data/currencies";
import { getCurrencySymbol } from "@/utils/currency";

interface CurrencySelectPageProps {
  selected: string;
  onBack: () => void;
  onSelect: (code: string) => void;
}

function CurrencySelectPage({
  selected,
  onBack,
  onSelect,
}: CurrencySelectPageProps) {
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
          Chọn Tiền Tệ
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="space-y-2">
          {currencies.map((currency) => {
            const isSelected = selected === currency.code;
            return (
              <button
                key={currency.code}
                type="button"
                onClick={() => onSelect(currency.code)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-text-primary"
                }`}
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-base font-bold ${
                    isSelected ? "bg-primary-400/40" : "bg-surface-secondary"
                  }`}
                >
                  {getCurrencySymbol(currency.code)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{currency.code}</span>
                  <span
                    className={`block truncate text-xs ${
                      isSelected ? "text-primary-foreground/75" : "text-text-secondary"
                    }`}
                  >
                    {currency.name}
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

export default CurrencySelectPage;
