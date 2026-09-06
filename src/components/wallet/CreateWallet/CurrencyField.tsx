import { Field, FieldLabel } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { currencies } from "@/data/currencies";

interface CurrencyFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function CurrencyField({ value, onChange }: CurrencyFieldProps) {
  const items = currencies.map((currency) => ({
    label: `${currency.code} — ${currency.name}`,
    value: currency.code,
  }));

  return (
    <Field className="gap-2">
      <FieldLabel>Đơn vị tiền tệ</FieldLabel>

      <Select
        items={items}
        value={value}
        onValueChange={(newValue) => {
          if (newValue !== null) {
            onChange(newValue);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn tiền tệ" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Đơn vị tiền tệ</SelectLabel>

            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

export default CurrencyField;
