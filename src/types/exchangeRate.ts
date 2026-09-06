export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CachedExchangeRates extends ExchangeRates {
  fetchedAt: string;
}
