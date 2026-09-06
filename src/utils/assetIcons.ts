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
  const entry = Object.entries(icons).find(
    ([path]) => path.split("/").pop() === filename,
  );

  return entry?.[1] as string | undefined;
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
