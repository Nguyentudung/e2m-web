export interface Currency {
  code: string;
  name: string;
  locale: string;
}

export const currencies: Currency[] = [
  {
    code: "VND",
    name: "Việt Nam Đồng",
    locale: "vi-VN",
  },
  {
    code: "USD",
    name: "US Dollar",
    locale: "en-US",
  },
  {
    code: "EUR",
    name: "Euro",
    locale: "de-DE",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    locale: "ja-JP",
  },
  {
    code: "KRW",
    name: "Korean Won",
    locale: "ko-KR",
  },
];
