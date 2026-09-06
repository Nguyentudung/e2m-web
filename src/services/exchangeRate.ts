import type { CachedExchangeRates, ExchangeRates } from "@/types/exchangeRate";

const API_URL = "https://api.frankfurter.dev/v2/rates";
const STORAGE_KEY = "montra-exchange-rates";
const BASE_CURRENCY = "VND";

function getToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());
}

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  const response = await fetch(`${API_URL}?base=${BASE_CURRENCY}`);

  if (!response.ok) {
    throw new Error("Không thể lấy tỷ giá từ Frankfurter.");
  }

  const data = await response.json();

  const rates: Record<string, number> = {
    [BASE_CURRENCY]: 1,
  };

  for (const item of data) {
    rates[item.quote] = item.rate;
  }

  return {
    base: BASE_CURRENCY,
    date: data[0]?.date ?? getToday(),
    rates,
  };
}

export function getCachedExchangeRates(): CachedExchangeRates | null {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as CachedExchangeRates;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveExchangeRates(rates: ExchangeRates): CachedExchangeRates {
  const cached: CachedExchangeRates = {
    ...rates,
    fetchedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));

  return cached;
}

export async function getExchangeRates(): Promise<ExchangeRates> {
  const cached = getCachedExchangeRates();
  const today = getToday();

  if (cached && cached.fetchedAt) {
    const cachedDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(new Date(cached.fetchedAt));

    if (cachedDate === today && cached.base === BASE_CURRENCY) {
      return cached;
    }
  }

  const rates = await fetchExchangeRates();

  return saveExchangeRates(rates);
}
