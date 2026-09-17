import { HugeiconsIcon } from "@hugeicons/react";
import { type Category } from "@/constants/categories";

interface CategoryPickerProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map((cat) => {
        const isSelected = cat.id === selected;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`
              flex flex-col items-center gap-1.5 rounded-2xl px-1 py-3
              transition-colors duration-150
              ${isSelected
                ? "bg-primary-100 dark:bg-primary-500/20"
                : "hover:bg-surface-secondary active:bg-surface-secondary"
              }
            `}
            aria-label={cat.name}
            aria-pressed={isSelected}
          >
            <div
              className={`
                flex size-11 items-center justify-center rounded-xl
                ${isSelected ? "bg-primary-500" : "bg-surface"}
              `}
              style={!isSelected ? { backgroundColor: cat.color + "22" } : undefined}
            >
              <HugeiconsIcon
                icon={cat.icon}
                size={22}
                strokeWidth={1.8}
                color={isSelected ? "#ffffff" : cat.color}
              />
            </div>
            <span
              className={`
                text-center text-[11px] leading-tight
                ${isSelected ? "font-semibold text-primary-500" : "text-text-secondary"}
              `}
            >
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
