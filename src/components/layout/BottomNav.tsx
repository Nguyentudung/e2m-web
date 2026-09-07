import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";

function BottomNav() {
  const mainItems = navigationItems.filter((item) => !item.isPrimary);
  const primaryItem = navigationItems.find((item) => item.isPrimary);

  const navigate = useNavigate();
  const location = useLocation();

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const activeIndex = mainItems.findIndex((item) =>
    location.pathname.startsWith(item.path),
  );

  // --- "Adjust state during render" pattern (theo react.dev) ---
  // Theo dõi pathname trước đó bằng state, so sánh ngay trong lúc render.
  // Khi phát hiện pathname vừa đổi VÀ đang có một lần kéo đang chờ route
  // cập nhật khớp, tắt drag NGAY trong render này (không qua effect),
  // tránh render thừa/nhấp nháy.
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  let renderDragIndex = dragIndex;

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    if (
      dragIndex !== null &&
      location.pathname.startsWith(mainItems[dragIndex].path)
    ) {
      setDragIndex(null);
      renderDragIndex = null; // để chính render hiện tại cũng phản ánh ngay, không đợi thêm 1 lượt
    }
  }

  const isDisplayingDrag = renderDragIndex !== null;
  const displayIndex = isDisplayingDrag ? renderDragIndex : activeIndex;

  const findIndexAtPoint = (
    clientX: number,
    clientY: number,
  ): number | null => {
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return i;
      }
    }
    return null;
  };

  const handlePointerDown =
    (index: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
      containerRef.current?.setPointerCapture(e.pointerId);
      setDragIndex(index);
    };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragIndex === null) return;
    const found = findIndexAtPoint(e.clientX, e.clientY);
    if (found !== null && found !== dragIndex) {
      setDragIndex(found);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragIndex === null) return;
    const found = findIndexAtPoint(e.clientX, e.clientY) ?? dragIndex;
    const targetPath = mainItems[found].path;

    setDragIndex(found);

    if (location.pathname.startsWith(targetPath)) {
      // Thả trúng tab hiện tại -> route không đổi -> tắt drag ngay,
      // vì sẽ không có lần "pathname khác prevPathname" nào xảy ra để tự tắt hộ
      setDragIndex(null);
    } else {
      navigate(targetPath);
      // Không tắt drag ở đây. Đoạn so sánh prevPathname phía trên
      // sẽ tự tắt drag đúng lúc pathname thật sự đổi khớp.
    }
  };

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-center gap-3">
        {/* ================================================== */}
        {/* MAIN NAVIGATION */}
        {/* ================================================== */}

        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDragIndex(null)}
          className=" 
            relative flex h-16 flex-1 items-center justify-around 
            rounded-full 
            border-[1.5px] border-light-base 
            dark:border-none 
            bg-background/45 
            p-0.5
            backdrop-blur-xs 
            shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] 
            touch-none select-none
          "
        >
          {mainItems.map((item, index) => {
            const isDisplayed = index === displayIndex;
            return (
              <button
                key={item.path}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                aria-label={item.label}
                onPointerDown={handlePointerDown(index)}
                className="relative flex h-full flex-1 items-center justify-center"
              >
                {isDisplayed && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-full bg-primary-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]"
                    animate={{ scale: isDisplayingDrag ? 1.08 : 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <div
                  className={[
                    "relative z-10 flex h-full w-full items-center justify-center",
                    "transition-colors duration-200",
                    isDisplayed
                      ? "text-light-base"
                      : "text-text-secondary hover:text-text-primary",
                  ].join(" ")}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={24}
                    strokeWidth={isDisplayed ? 2.4 : 1.8}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* ================================================== */}
        {/* PRIMARY ACTION */}
        {/* ================================================== */}

        {primaryItem && (
          <button
            type="button"
            aria-label={primaryItem.label}
            onClick={() => navigate(primaryItem.path)}
            className="shrink-0"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="
                flex size-16 items-center justify-center
                rounded-full
                bg-primary-accent
                text-white
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]
              "
            >
              <HugeiconsIcon
                icon={primaryItem.icon}
                size={30}
                strokeWidth={2.2}
              />
            </motion.div>
          </button>
        )}
      </div>
    </nav>
  );
}

export default BottomNav;
