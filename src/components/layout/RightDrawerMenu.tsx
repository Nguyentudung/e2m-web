import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Switch } from "../ui/switch";

interface RightDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RightDrawerMenu({ isOpen, onClose }: RightDrawerMenuProps) {
  const [isDark, setIsDark] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Sync theme status on mount and when changed
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeToggle = (checked: boolean) => {
    setIsDark(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const guideItems = [
    { title: "Hướng dẫn sử dụng cơ bản", desc: "Các thao tác chính để quản lý tài chính hàng ngày" },
    { title: "Cách xem & xuất báo cáo", desc: "Theo dõi dòng tiền thu chi chi tiết" },
    { title: "Quản lý danh mục & ví tiền", desc: "Phân loại nguồn tiền và các khoản ngân sách" },
    { title: "Mẹo & Bảo mật tài khoản", desc: "Giữ an toàn dữ liệu cá nhân" },
  ];

  return (
    <>
      {/* BACKDROP OVERLAY - ONLY DIM BRIGHTNESS (NO BLUR) */}
      <div
        className="fixed inset-0 z-50 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* OKX-STYLE SETTINGS PANEL */}
      <aside
        className="fixed top-0 right-0 z-50 flex h-full w-80 max-w-[85vw] flex-col bg-surface text-text-primary p-5"
        aria-label="Cài đặt"
      >
        {/* PANEL HEADER WITH BOUNDED DIVIDER */}
        <div className="flex h-12 items-center justify-between border-b border-border pb-3">
          <span className="text-base font-semibold text-text-primary">Cài đặt</span>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Đóng cài đặt"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* PANEL CONTENT - DIVIDERS CONTAINED WITHIN INNER CONTENT BOX */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1">
          {/* ITEM 1: CHỦ ĐỀ */}
          <div className="flex h-13 items-center justify-between border-b border-border">
            <span className="text-sm font-medium text-text-primary">Chủ đề</span>

            <Switch
              checked={isDark}
              onCheckedChange={handleThemeToggle}
              aria-label="Chuyển đổi chủ đề Sáng / Tối"
            />
          </div>

          {/* ITEM 2: HƯỚNG DẪN (ACCORDION) */}
          <div className="border-b border-border">
            <button
              type="button"
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="flex h-13 w-full items-center justify-between text-left transition-colors"
            >
              <span className="text-sm font-medium text-text-primary">Hướng dẫn</span>

              <HugeiconsIcon
                icon={isGuideOpen ? ArrowDown01Icon : ArrowRight01Icon}
                size={16}
                strokeWidth={2}
                className="text-text-secondary"
              />
            </button>

            {/* EXPANDABLE GUIDE SUB-ITEMS */}
            {isGuideOpen && (
              <div className="pb-3 pt-1 space-y-3">
                {guideItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer py-1"
                  >
                    <p className="text-xs font-semibold text-text-primary hover:text-text-brand-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-text-secondary mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
