import type { ExchangeRates } from "@/types/exchangeRate";

export function convertToVnd(
  amount: number,
  currency: string,
  rates: ExchangeRates,
): number {
  if (currency === "VND") {
    return amount;
  }

  const rate = rates.rates[currency];

  if (!rate || rate <= 0) {
    throw new Error(`Không tìm thấy tỷ giá cho ${currency}/VND.`);
  }

  // Frankfurter đang dùng VND làm base:
  // 1 VND = rate [currency]
  //
  // Muốn đổi currency -> VND:
  // amount / rate
  return amount / rate;
}
