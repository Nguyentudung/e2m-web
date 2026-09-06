import { currencies } from "@/data/currencies";

export function getCurrency(currencyCode: string) {
  return currencies.find((currency) => currency.code === currencyCode);
}

export function getCurrencySymbol(currencyCode: string) {
  const currency = getCurrency(currencyCode);

  if (!currency) {
    return currencyCode;
  }

  return (
    new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currencyCode
  );
}

export function formatCurrency(value: number, currencyCode: string) {
  const currency = getCurrency(currencyCode);

  if (!currency) {
    return value.toLocaleString();
  }

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
  }).format(value);
}
