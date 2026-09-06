import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building03Icon,
  CreditCardIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";

import { Field, FieldLabel } from "@/components/ui/field";

import type { AssetType, SelectedAsset } from "../CreateWalletPage";

interface AssetSelectorFieldProps {
  type: AssetType;
  selectedAsset: SelectedAsset | null;
  selectedAssetIcon?: string;
  onSelect: () => void;
}

// Hàm hỗ trợ ghép nối đường dẫn tới thư mục src/assets/icons/
function getAssetIconUrl(
  type: AssetType,
  iconFileName?: string,
): string | null {
  if (!iconFileName) return null;

  // Nếu iconFileName đã là đường dẫn đầy đủ hoặc link URL thì giữ nguyên
  if (iconFileName.startsWith("data:") || iconFileName.startsWith("http")) {
    return iconFileName;
  }

  // Xác định tên thư mục con trong src/assets/icons/ dựa theo loại tài sản
  const folder =
    type === "bank" ? "banks" : type === "ewallet" ? "ewallets" : "card";

  try {
    // Sử dụng new URL với Vite để tự động resolve đường dẫn trong src/assets/
    return new URL(
      `../../../assets/icons/${folder}/${iconFileName}`,
      import.meta.url,
    ).href;
  } catch (error) {
    console.error("Lỗi tải icon:", error);
    return null;
  }
}

function AssetSelectorField({
  type,
  selectedAsset,
  selectedAssetIcon,
  onSelect,
}: AssetSelectorFieldProps) {
  const [hasImageError, setHasImageError] = useState(false);

  // 1. Lấy tên file ảnh từ selectedAssetIcon hoặc selectedAsset.icon
  const iconFileName = selectedAssetIcon || selectedAsset?.icon;

  // 2. Ghép nối đường dẫn tới src/assets/icons/{banks|ewallets|card}/{iconFileName}
  const imageSrc = getAssetIconUrl(type, iconFileName);

  const label =
    type === "bank"
      ? "Ngân hàng"
      : type === "ewallet"
        ? "Ví điện tử"
        : "Loại thẻ";

  const fallbackIcon =
    type === "bank"
      ? Building03Icon
      : type === "ewallet"
        ? SmartPhone01Icon
        : CreditCardIcon;

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>

      <button
        type="button"
        onClick={onSelect}
        className="
          flex min-h-16 w-full
          items-center gap-3
          rounded-xl
          border border-white/10
          bg-surface/90
          px-3 py-2.5
          text-left
          transition
          hover:bg-surface
          active:scale-[0.99]
        "
      >
        <div
          className="
            flex size-11 shrink-0
            items-center justify-center
            overflow-hidden
            rounded-xl
            bg-background
          "
        >
          {imageSrc && !hasImageError ? (
            <img
              src={imageSrc}
              alt={selectedAsset?.name ?? ""}
              className="size-7 object-contain"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <HugeiconsIcon
              icon={fallbackIcon}
              size={21}
              strokeWidth={1.8}
              className="text-text-secondary"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">
            {selectedAsset?.name ?? `Chọn ${label.toLowerCase()}`}
          </p>

          <p className="mt-0.5 text-xs text-text-secondary">
            {selectedAsset ? "Nhấn để thay đổi" : "Nhấn để lựa chọn"}
          </p>
        </div>

        <span className="text-xs font-semibold text-text-secondary">
          {selectedAsset ? "Thay đổi" : "Chọn"}
        </span>
      </button>
    </Field>
  );
}

export default AssetSelectorField;
