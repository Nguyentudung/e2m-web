import { Field, FieldLabel } from "@/components/ui/field";

import { Textarea } from "@/components/ui/textarea";

interface NoteFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function NoteField({ value, onChange }: NoteFieldProps) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="wallet-note">Ghi chú</FieldLabel>

        <span className="text-xs text-text-secondary">{value.length}/200</span>
      </div>

      <Textarea
        id="wallet-note"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ví dụ: Tiền tiêu hàng ngày..."
        maxLength={200}
        className="
          min-h-28
          resize-none
          rounded-xl
          border-white/10
          bg-surface/90
          px-4 py-3.5
          text-sm
        "
      />
    </Field>
  );
}

export default NoteField;
