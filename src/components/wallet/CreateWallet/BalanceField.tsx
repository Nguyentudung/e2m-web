import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { getCurrencySymbol } from "@/utils/currency";

interface BalanceFieldProps {
  value: string;
  currency: string;
  onChange: (value: string) => void;
}

function BalanceField({ value, currency, onChange }: BalanceFieldProps) {
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Field className="gap-2">
      <FieldLabel htmlFor="wallet-balance">Số dư</FieldLabel>

      <div className="relative">
        <Input
          id="wallet-balance"
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0"
          className="
            h-8
            w-full
            rounded-lg
            border-background
            bg-surface/90
            px-4
            pr-12
            text-sm
          "
        />

        {currencySymbol && (
          <span
            className="
              pointer-events-none
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-sm
              font-semibold
              text-text-secondary
            "
          >
            {currencySymbol}
          </span>
        )}
      </div>
    </Field>
  );
}

export default BalanceField;
