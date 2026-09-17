// src/components/transactions/AnimatedAmount.tsx
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedAmountProps {
  value: string;
  symbol?: string;
  className?: string;
}

export function AnimatedAmount({
  value,
  symbol = "₫",
  className = "",
}: AnimatedAmountProps) {
  let digitCounter = 0;
  const characters = value.split("");

  return (
    <div className={`flex items-baseline justify-center overflow-hidden py-2 ${className}`}>
      <div className="inline-flex items-baseline font-bold tracking-tight tabular-nums">
        {characters.map((char, index) => {
          // Bỏ qua các ký tự phân cách tĩnh (dấu chấm, phẩy...)
          if (isNaN(Number(char))) {
            return (
              <span key={`static-${char}-${index}`} className="inline-block px-[1px]">
                {char}
              </span>
            );
          }

          const positionFromLeft = digitCounter;
          digitCounter++;

          const stableKey = `digit-index-${positionFromLeft}`;

          return (
            <div
              key={stableKey}
              className="relative inline-block overflow-hidden"
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={`${stableKey}-${char}`}
                  /* Hiệu ứng Pop-in giống InputOTP: Scale từ nhỏ nở to + mờ sang rõ */
                  initial={{ scale: 0.5, opacity: 0, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: -4 }}
                  transition={{
                    type: "spring",
                    stiffness: 600,
                    damping: 25,
                    mass: 0.5,
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              </AnimatePresence>
            </div>
          );
        })}

        {symbol && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="ml-2 text-3xl font-semibold text-text-secondary"
          >
            {symbol}
          </motion.span>
        )}
      </div>
    </div>
  );
}