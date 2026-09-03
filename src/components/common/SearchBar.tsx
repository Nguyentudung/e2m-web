import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

function SearchBar() {
  return (
    <div className="flex h-15 w-full items-center rounded-full border border-border bg-surface px-5">
      <HugeiconsIcon
        icon={Search01Icon}
        size={25}
        color="currentColor"
        strokeWidth={2}
        className="shrink-0 text-text-primary"
      />

      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="ml-4 w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-secondary"
      />
    </div>
  );
}

export default SearchBar;
