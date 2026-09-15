import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { useIsDark } from "../../hooks/useIsDark";

function BottomNav() {
  const isDark = useIsDark();
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
      setDragIndex(null);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <nav
      className="
        fixed inset-x-0 bottom-4 z-50
        px-3 sm:px-4
        md:hidden
      "
    >
      <div
        className="
          mx-auto flex w-full max-w-lg min-w-0
          items-center justify-center
          gap-[clamp(6px,2vw,12px)]
        "
      >
        {/* ================================================== */}
        {/* MAIN NAVIGATION */}
        {/* ================================================== */}

        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDragIndex(null)}
          className="
            relative flex min-w-0 flex-1
            items-center justify-between
            overflow-hidden

            h-14 sm:h-16
            gap-1.5
            p-1.5

            rounded-full

            /* Light theme → dark taskbar */
            bg-dark-base

            /* Dark theme → light taskbar */
            dark:bg-light-base

            shadow-[0_4px_18px_rgba(0,0,0,0.14)]
            dark:shadow-[0_4px_18px_rgba(0,0,0,0.32)]

            touch-none
            select-none
          "
        >
          {mainItems.map((item, index) => {
            const isDisplayed = index === displayIndex;
            const iconColor = isDisplayed
              ? "#ffffff"
              : isDark
                ? "rgba(0, 0, 0, 1)"
                : "rgba(255, 255, 255, 1)";

            return (
              <button
                key={item.path}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                aria-label={item.label}
                onPointerDown={handlePointerDown(index)}
                className="
                  relative
                  flex
                  min-w-0
                  shrink
                  basis-0
                  flex-1
                  items-center
                  justify-center

                  h-full
                  rounded-full
                "
              >
                {isDisplayed && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="
                      absolute inset-0
                      rounded-full
                      bg-primary-400

                      shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]
                    "
                    animate={{
                      scale: isDisplayingDrag ? 1.05 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <div
                  className="
                    relative z-10
                    flex h-full w-full
                    items-center justify-center
                    rounded-full
                    transition-colors duration-200
                  "
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={24}
                    color={iconColor}
                    strokeWidth={isDisplayed ? 2.4 : 1.8}
                    className="size-[clamp(20px,5.5vw,24px)] transition-colors duration-200"
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
            className="
              shrink-0
              rounded-full
            "
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="
                flex
                size-14 sm:size-16
                items-center
                justify-center

                rounded-full

                border-[1.5px]
                border-light-base
                dark:border-dark-base

                bg-primary-accent/85
                text-white

                backdrop-blur-xs

                shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]
              "
            >
              <HugeiconsIcon
                icon={primaryItem.icon}
                size={28}
                strokeWidth={2.2}
                className="
                  size-7
                "
              />
            </motion.div>
          </button>
        )}
      </div>
    </nav>
  );
}

export default BottomNav;
