import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

interface ExpandableSearchProps {
  className?: string;
}

export default function ExpandableSearch({
  className = "",
}: ExpandableSearchProps) {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
      expandTimerRef.current = null;
    }

    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    // Hủy việc thu lại nếu chuột quay vào
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }

    // Nếu đã mở thì không cần làm gì
    if (isExpanded) return;

    // Chờ 0.75s trước khi mở
    expandTimerRef.current = setTimeout(() => {
      setIsExpanded(true);
      expandTimerRef.current = null;
    }, 250);
  };

  const handleMouseLeave = () => {
    // Hủy timer mở nếu chưa đủ 0.75s
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
      expandTimerRef.current = null;
    }

    // Nếu đang nhập nội dung thì không thu lại
    if (query.trim()) return;

    // Chờ 0.5s trước khi thu
    collapseTimerRef.current = setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setIsExpanded(false);
      }

      collapseTimerRef.current = null;
    }, 250);
  };

  const handleFocus = () => {
    clearTimers();
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!query.trim()) {
      // Không thu ngay khi blur
      collapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
        collapseTimerRef.current = null;
      }, 500);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleSearchClick = () => {
    clearTimers();
    setIsExpanded(true);

    // Focus input sau khi mở
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  // Dọn timer khi component bị unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div
      className={`group relative flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`
          flex h-10 items-center overflow-hidden rounded-full border border-border
          bg-surface/85 backdrop-blur-md
          transition-all duration-300 ease-out
          ${
            isExpanded
              ? "w-56 px-3 border-primary-400/50"
              : "w-10 px-0 justify-center hover:bg-surface"
          }
        `}
      >
        <button
          type="button"
          onClick={handleSearchClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-text-secondary transition-colors group-hover:text-text-primary focus:outline-none"
          aria-label="Tìm kiếm"
        >
          <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.8} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Tìm kiếm..."
          className={`
            w-full bg-transparent text-sm text-text-primary
            placeholder:text-text-tertiary
            transition-opacity duration-200 focus:outline-none
            ${isExpanded ? "opacity-100 pr-2" : "opacity-0 pointer-events-none"}
          `}
        />

        {query && isExpanded && (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
            aria-label="Xóa nội dung"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
}
