import { HugeiconsIcon } from "@hugeicons/react";
import { NavLink } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { Button } from "../ui/button";

function DesktopNav() {
  return (
    <nav className="flex items-center gap-1">
      {navigationItems.map((item) =>
        item.isPrimary ? (
          <NavLink key={item.path} to={item.path}>
            <Button className="h-10 px-4 rounded-full font-semibold">
              <HugeiconsIcon icon={item.icon} size={21} strokeWidth={2.4} />
              <span>{item.label}</span>
            </Button>
          </NavLink>
        ) : (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "flex h-10 items-center gap-2 rounded-full px-4",
                "text-sm font-semibold transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                isActive
                  ? "bg-surface-secondary text-text-primary"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <HugeiconsIcon
                  icon={item.icon}
                  size={21}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={
                    isActive ? "text-text-primary" : "text-text-secondary"
                  }
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ),
      )}
    </nav>
  );
}

export default DesktopNav;
