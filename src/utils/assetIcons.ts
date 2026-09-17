import { banks } from "@/data/banks";
import { ewallets } from "@/data/ewallets";
import { cards } from "@/data/cards";

const bankIcons = import.meta.glob("../assets/icons/banks/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

const ewalletIcons = import.meta.glob("../assets/icons/ewallets/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

const cardIcons = import.meta.glob("../assets/icons/cards/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});

function findIcon(icons: Record<string, unknown>, filename: string) {
  const normalizedFilename = filename.split(/[\\/]/).pop()?.toLowerCase();

  if (!normalizedFilename) {
    return undefined;
  }

  const entry = Object.entries(icons).find(
    ([path]) => path.split("/").pop()?.toLowerCase() === normalizedFilename,
  );

  return typeof entry?.[1] === "string" ? entry[1] : undefined;
}

export function getBankIcon(filename: string) {
  return findIcon(bankIcons, filename);
}

export function getEwalletIcon(filename: string) {
  return findIcon(ewalletIcons, filename);
}

export function getCardIcon(filename: string) {
  return findIcon(cardIcons, filename);
}

export function getAssetIcon(
  type: "cash" | "bank" | "ewallet" | "card",
  filename?: string,
) {
  if (!filename || type === "cash") {
    return undefined;
  }

  if (type === "bank") {
    return getBankIcon(filename);
  }

  if (type === "ewallet") {
    return getEwalletIcon(filename);
  }

  return getCardIcon(filename);
}

export function getAssetMetadata(
  type: "cash" | "bank" | "ewallet" | "card",
  assetId?: string,
) {
  if (!assetId || type === "cash") {
    return undefined;
  }

  if (type === "bank") {
    return banks.find((asset) => asset.id === assetId);
  }

  if (type === "ewallet") {
    return ewallets.find((asset) => asset.id === assetId);
  }

  return cards.find((asset) => asset.id === assetId);
}

export function resolveAsset(
  type: "cash" | "bank" | "ewallet" | "card",
  assetId?: string,
  assetName?: string,
  assetIcon?: string,
) {
  const metadata = getAssetMetadata(type, assetId);
  const icon = getAssetIcon(type, assetIcon ?? metadata?.icon);

  return {
    name:
      assetName ??
      metadata?.name ??
      (type === "cash" ? "Tiền mặt" : assetId ?? "Tài sản"),
    icon,
  };
}
