import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Eraser01Icon,
  PlusSignIcon,
  MinusSignIcon,
  Tick02Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";

interface NumberPadProps {
  value: string;
  onChange: (value: string) => void;
  onToday?: () => void;
  onOperator?: (operator: "income" | "expense") => void;
  onConfirm?: () => void;
  maxDigits?: number;
}

interface DigitKey {
  kind: "digit";
  label: string;
  value: string;
}

interface ActionKey {
  kind: "action";
  label: string;
  onPress: () => void;
}

type PadKey = DigitKey | ActionKey;

export default function NumberPad({
  value,
  onChange,
  onToday,
  onOperator,
  onConfirm,
  maxDigits = 13,
}: NumberPadProps) {
  const pressDigit = (key: string) => {
    const raw = value === "0" ? key : value + key;
    const normalized = raw.replace(/^0+(\d)/, "$1");
    const digitCount = normalized.replace(".", "").length;
    if (digitCount > maxDigits) return;
    onChange(normalized);
  };

  const backspace = () => {
    onChange(value.length > 1 ? value.slice(0, -1) : "0");
  };

  const keys: PadKey[] = [
    { kind: "digit", label: "1", value: "1" },
    { kind: "digit", label: "2", value: "2" },
    { kind: "digit", label: "3", value: "3" },
    { kind: "action", label: "Xóa số", onPress: backspace },
    { kind: "digit", label: "4", value: "4" },
    { kind: "digit", label: "5", value: "5" },
    { kind: "digit", label: "6", value: "6" },
    { kind: "action", label: "Thu nhập", onPress: () => onOperator?.("income") },
    { kind: "digit", label: "7", value: "7" },
    { kind: "digit", label: "8", value: "8" },
    { kind: "digit", label: "9", value: "9" },
    { kind: "action", label: "Chi tiêu", onPress: () => onOperator?.("expense") },
    { kind: "digit", label: "000", value: "000" },
    { kind: "digit", label: "0", value: "0" },
    { kind: "action", label: "Hôm nay", onPress: () => onToday?.() },
    { kind: "action", label: "Lưu giao dịch", onPress: () => onConfirm?.() },
  ];

  const baseClass =
    "flex h-[clamp(3.25rem,13vw,4.5rem)] items-center justify-center rounded-2xl select-none touch-manipulation transition-colors duration-100";

  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
      {keys.map((key, index) => {
        const isConfirm = index === keys.length - 1;

        if (key.kind === "digit") {
          return (
            <motion.button
              key={`digit-${key.label}`}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => pressDigit(key.value)}
              className={`${baseClass} bg-surface text-2xl font-semibold text-text-primary active:bg-surface-secondary`}
              aria-label={key.label}
            >
              {key.label}
            </motion.button>
          );
        }

        const isOperator = key.label === "Thu nhập" || key.label === "Chi tiêu";

        return (
          <motion.button
            key={`action-${index}`}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={key.onPress}
            className={
              isConfirm
                ? `${baseClass} bg-primary-accent text-primary-accent-text`
                : isOperator
                  ? `${baseClass} bg-surface text-text-primary active:bg-surface-secondary`
                  : `${baseClass} bg-surface text-text-primary active:bg-surface-secondary`
            }
            aria-label={key.label}
          >
            {index === 3 && (
              <HugeiconsIcon
                icon={Eraser01Icon}
                size={24}
                strokeWidth={2}
                className="rotate-180"
              />
            )}
            {index === 7 && <HugeiconsIcon icon={PlusSignIcon} size={24} strokeWidth={2} />}
            {index === 11 && <HugeiconsIcon icon={MinusSignIcon} size={24} strokeWidth={2} />}
            {index === 14 && <HugeiconsIcon icon={Calendar03Icon} size={24} strokeWidth={1.8} />}
            {isConfirm && <HugeiconsIcon icon={Tick02Icon} size={26} strokeWidth={2.4} />}
          </motion.button>
        );
      })}
    </div>
  );
}