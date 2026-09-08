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

  // path "/" là prefix của MỌI đường dẫn, nên so khớp tuyệt đối riêng cho nó,
  // các path khác vẫn cho phép khớp route con (vd "/wallets/history" -> tab "Ví")
  const activeIndex = mainItems.findIndex((item) =>
    location.pathname.startsWith(item.path),
  );

  // --- "Adjust state during render" pattern (theo react.dev) ---
  // So sánh pathname hiện tại với pathname ở lần render trước, ngay trong
  // thân component (không dùng useEffect), để tắt trạng thái kéo đúng lúc
  // route thật sự đổi khớp, tránh render thừa/nhấp nháy.
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  let renderDragIndex = dragIndex;

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    if (
      dragIndex !== null &&
      location.pathname.startsWith(mainItems[dragIndex].path)
    ) {
      setDragIndex(null);
      renderDragIndex = null;
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
      // Thả trúng tab hiện tại -> route không đổi -> tắt drag ngay
      setDragIndex(null);
    } else {
      navigate(targetPath);
      // Không tắt drag ở đây - khối so sánh prevPathname phía trên
      // sẽ tự tắt đúng lúc pathname thật sự đổi khớp.
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
            border-[1.5px] border-dark-base 
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
                    // Đổi từ "absolute inset-0" (cao bằng cả ô) sang chiều cao cố định,
                    // canh giữa theo chiều dọc bằng top-1/2 + -translate-y-1/2.
                    // Nhờ vậy dù ô tab rộng hay hẹp theo từng màn hình, pill luôn
                    // "dẹt" (rộng hơn cao) thay vì bị vuông/tròn trên màn hình nhỏ.
                    className="absolute left-0 right-0 top-1/2 h-11 -translate-y-1/2 rounded-full bg-primary-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]"
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
                backdrop-blur-xs
                border-[1.5px] border-light-base
                bg-primary-accent/85
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
