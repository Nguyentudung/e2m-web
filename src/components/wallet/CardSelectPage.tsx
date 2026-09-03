import { useMemo, useState } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Search01Icon,
  ArrowRight01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";

import { Input } from "@/components/ui/input";

import { cards } from "@/data/cards";
import { getCardIcon } from "@/utils/assetIcons";

interface CardSelectPageProps {
  onBack: () => void;

  onSelect: (card: { id: string; name: string; icon: string }) => void;
}

function CardSelectPage({ onBack, onSelect }: CardSelectPageProps) {
  const [search, setSearch] = useState("");

  const filteredCards = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return cards;
    }

    return cards.filter((card) => {
      return (
        card.id.toLowerCase().includes(keyword) ||
        card.name.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  return (
    <section className="min-h-[75vh] px-4 pb-28 pt-5 sm:px-6 sm:pt-7">
      <div className="mx-auto w-full max-w-xl">
        {/* HEADER */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Quay lại"
            className="
              flex size-11 shrink-0 items-center justify-center
              rounded-full
              border border-white/10
              bg-surface/90
              text-text-primary
              backdrop-blur-xl
              shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
              transition-all duration-200
              hover:bg-surface
              active:scale-95
            "
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={21} strokeWidth={2} />
          </button>

          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Chọn loại thẻ
            </h1>

            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              Chọn loại thẻ bạn muốn thêm
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mb-4">
          <HugeiconsIcon
            icon={Search01Icon}
            size={20}
            strokeWidth={1.9}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-text-secondary
            "
          />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm loại thẻ..."
            className="
              h-13
              rounded-2xl
              border-white/10
              bg-surface/90
              pl-11 pr-4
              text-sm
              text-text-primary
              backdrop-blur-xl
              shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
              placeholder:text-text-secondary/60
              focus-visible:border-primary-400/50
              focus-visible:ring-1
              focus-visible:ring-primary-400/20
            "
          />
        </div>

        {/* COUNT */}
        <div className="mb-3 px-1">
          <p className="text-xs font-medium text-text-secondary">
            {filteredCards.length} loại thẻ
          </p>
        </div>

        {/* LIST */}
        <div className="space-y-2">
          {filteredCards.map((card) => {
            const iconSrc = getCardIcon(card.icon);

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelect(card)}
                className="
                  group flex w-full items-center gap-3
                  rounded-2xl
                  border border-white/10
                  bg-surface/90
                  p-2.5
                  text-left
                  backdrop-blur-xl
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                  transition-all duration-200
                  hover:bg-surface
                  active:scale-[0.99]
                "
              >
                {/* ICON */}
                <div
                  className="
                    flex size-12 shrink-0
                    items-center justify-center
                    overflow-hidden
                    rounded-xl
                    bg-white
                    p-2
                  "
                >
                  {iconSrc ? (
                    <img
                      src={iconSrc}
                      alt=""
                      className="size-8 object-contain"
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={CreditCardIcon}
                      size={22}
                      strokeWidth={1.8}
                      className="text-text-secondary"
                    />
                  )}
                </div>

                {/* INFO */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {card.id}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-text-secondary">
                    {card.name}
                  </p>
                </div>

                {/* ARROW */}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={19}
                  strokeWidth={1.9}
                  className="
                    mr-1 shrink-0
                    text-text-secondary
                    transition-transform duration-200
                    group-hover:translate-x-0.5
                    group-hover:text-text-primary
                  "
                />
              </button>
            );
          })}

          {/* EMPTY */}
          {filteredCards.length === 0 && (
            <div
              className="
                rounded-2xl
                border border-white/10
                bg-surface/60
                px-4 py-12
                text-center
                backdrop-blur-xl
              "
            >
              <p className="text-sm font-medium text-text-primary">
                Không tìm thấy loại thẻ
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                Thử tìm kiếm bằng tên hoặc mã thẻ
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CardSelectPage;
