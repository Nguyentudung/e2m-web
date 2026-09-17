import { useRef, useCallback, useEffect } from "react";
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
  value?: string; // Để optional nếu nơi khác vẫn truyền prop này vào
  onChange: React.Dispatch<React.SetStateAction<string>>;
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
  onPress?: () => void;
  isDelete?: boolean;
}

type PadKey = DigitKey | ActionKey;

export default function NumberPad({
  onChange,
  onToday,
  onOperator,
  onConfirm,
  maxDigits = 13,
}: NumberPadProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLongPressRef = useRef(false);

  // 1. Logic xóa 1 ký tự
  const backspace = useCallback(() => {
    onChange((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  }, [onChange]);

  // 2. Dừng timer nhấn giữ
  const stopDelete = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 3. Bắt đầu nhấn giữ
  const startDelete = useCallback(() => {
    stopDelete();
    isLongPressRef.current = false;

    // Đợi 300ms nếu vẫn đè nút thì coi là nhấn giữ và liên tục xóa mỗi 60ms
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      intervalRef.current = setInterval(() => {
        onChange((prev: string) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      }, 60);
    }, 300);
  }, [onChange, stopDelete]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => stopDelete();
  }, [stopDelete]);

  const pressDigit = (key: string) => {
    onChange((prev) => {
      const raw = prev === "0" ? key : prev + key;
      const normalized = raw.replace(/^0+(\d)/, "$1");
      const digitCount = normalized.replace(".", "").length;
      if (digitCount > maxDigits) return prev;
      return normalized;
    });
  };

  const keys: PadKey[] = [
    { kind: "digit", label: "1", value: "1" },
    { kind: "digit", label: "2", value: "2" },
    { kind: "digit", label: "3", value: "3" },
    { kind: "action", label: "Xóa số", isDelete: true },
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

        if (key.isDelete) {
          return (
            <motion.button
              key={`action-delete-${index}`}
              type="button"
              whileTap={{ scale: 0.92 }}
              onPointerDown={startDelete}
              onPointerUp={() => {
                stopDelete();
                if (!isLongPressRef.current) {
                  backspace();
                }
              }}
              onPointerLeave={stopDelete}
              onPointerCancel={stopDelete}
              className={`${baseClass} bg-surface text-text-primary active:bg-surface-secondary`}
              aria-label={key.label}
            >
              <HugeiconsIcon
                icon={Eraser01Icon}
                size={24}
                strokeWidth={2}
                className="rotate-180"
              />
            </motion.button>
          );
        }

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