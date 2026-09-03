import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import ExpandableSearch from "./ExpandableSearch";

interface MobileHeaderProps {
  onOpenMenu: () => void;
}

function MobileHeader({ onOpenMenu }: MobileHeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-50
        h-14
        rounded-bl-[28px]
        bg-surface/85
        backdrop-blur-xl
      "
    >
      <div className="flex h-full items-center px-3 justify-between">
        {/* SEARCH */}
        <ExpandableSearch />

        {/* RIGHT MENU */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Mở menu"
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-full
            text-text-primary
            transition-colors
            hover:bg-background/50
            active:scale-90
          "
        >
          <HugeiconsIcon icon={Menu01Icon} size={23} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}

export default MobileHeader;
