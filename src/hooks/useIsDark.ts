import { useEffect, useState } from "react";

/**
 * Trả về true nếu giao diện hiện tại là dark mode.
 * Theo dõi thay đổi class "dark" trên <html> theo thời gian thực.
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
