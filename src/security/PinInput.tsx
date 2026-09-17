import { useEffect } from "react";
import { OTPInput } from "input-otp";

import { PIN_LENGTH } from "./pin";

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
}

export function PinInput({
  value,
  onChange,
  disabled,
  autoFocus = true,
  "aria-label": ariaLabel,
}: PinInputProps) {
  useEffect(() => {
    if (!autoFocus) return;
    const input = document.querySelector<HTMLInputElement>("[data-security-pin-input]");
    input?.focus();
  }, [autoFocus]);

  return (
    <OTPInput
      maxLength={PIN_LENGTH}
      value={value}
      onChange={onChange}
      inputMode="numeric"
      pattern="[0-9]*"
      disabled={disabled}
      data-security-pin-input=""
      aria-label={ariaLabel ?? "Mã PIN 6 chữ số"}
      containerClassName="flex justify-center gap-2"
      render={({ slots }) => (
        <>
          {slots.map((slot, index) => (
            <div
              key={index}
              className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-lg font-bold text-text-primary sm:size-12"
            >
              {slot.char ?? (slot.hasFakeCaret ? "|" : "")}
            </div>
          ))}
        </>
      )}
    />
  );
}
