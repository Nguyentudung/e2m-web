const bankIcons = import.meta.glob("/src/assets/icons/banks/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const ewalletIcons = import.meta.glob("/src/assets/icons/ewallets/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const cardIcons = import.meta.glob("/src/assets/icons/cards/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function getIcon(icons: Record<string, string>, iconName?: string) {
  if (!iconName) {
    return undefined;
  }

  const normalizedName = iconName
    .split("/")
    .pop()
    ?.replace(/\.[^/.]+$/, "")
    .toLowerCase();

  if (!normalizedName) {
    return undefined;
  }

  const entry = Object.entries(icons).find(([path]) => {
    const fileName = path
      .split("/")
      .pop()
      ?.replace(/\.[^/.]+$/, "")
      .toLowerCase();

    return fileName === normalizedName;
  });

  return entry?.[1];
}

export function getBankIcon(iconName?: string) {
  return getIcon(bankIcons, iconName);
}

export function getEwalletIcon(iconName?: string) {
  return getIcon(ewalletIcons, iconName);
}

export function getCardIcon(iconName?: string) {
  return getIcon(cardIcons, iconName);
}
