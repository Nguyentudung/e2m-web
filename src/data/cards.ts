export interface Card {
  id: string;
  name: string;
  icon: string;
}

export const cards: Card[] = [
  {
    id: "atm",
    name: "Thẻ ATM",
    icon: "ATM.png",
  },
  {
    id: "visa",
    name: "Thẻ Visa",
    icon: "VISA.png",
  },
];
