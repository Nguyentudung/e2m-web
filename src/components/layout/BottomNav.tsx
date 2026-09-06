import { HugeiconsIcon } from "@hugeicons/react";
import { NavLink } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";

function BottomNav() {
  const mainItems = navigationItems.filter((item) => !item.isPrimary);
  const primaryItem = navigationItems.find((item) => item.isPrimary);

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-center gap-3">
        {/* ================================================== */}
        {/* MAIN NAVIGATION */}
        {/* ================================================== */}

        <div
          className="
            relative flex h-16 flex-1 items-center
            rounded-full
            border-[1.5px] border-light-base
            dark:border-none
            bg-background/45
            p-2
            backdrop-blur-xs
            shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
          "
        >
          {mainItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              className="flex h-full flex-1 items-center justify-center"
            >
              {({ isActive }) => (
                <div
                  className={[
                    "flex h-12 items-center justify-center rounded-full",
                    "transition-all duration-200 ease-out",

                    isActive
                      ? [
                          "gap-1.5 px-4",
                          "bg-surface",
                          "text-text-primary",
                          "shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]",
                        ].join(" ")
                      : [
                          "w-12",
                          "text-text-secondary",
                          "hover:bg-background/50",
                          "hover:text-text-primary",
                        ].join(" "),
                  ].join(" ")}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={24}
                    strokeWidth={isActive ? 2.4 : 1.8}
                  />

                  {isActive && (
                    <span
                      className="
                        whitespace-nowrap
                        text-[10px]
                        font-semibold
                        leading-none
                      "
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* ================================================== */}
        {/* PRIMARY ACTION */}
        {/* ================================================== */}

        {primaryItem && (
          <NavLink
            to={primaryItem.path}
            aria-label={primaryItem.label}
            className="shrink-0"
          >
            <div
              className="
                flex size-16 items-center justify-center
                rounded-full
                bg-primary-accent
                text-white
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]
                transition-transform duration-200
                active:scale-95
              "
            >
              <HugeiconsIcon
                icon={primaryItem.icon}
                size={30}
                strokeWidth={2.2}
              />
            </div>
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default BottomNav;
