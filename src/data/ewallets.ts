export interface EWallet {
  id: string;
  name: string;
  icon: string;
}

export const ewallets: EWallet[] = [
  {
    id: "momo",
    name: "Ví điện tử MoMo",
    icon: "MOMO.png",
  },
  {
    id: "zalopay",
    name: "Ví điện tử ZaloPay",
    icon: "ZALOPAY.png",
  },
  {
    id: "viettel-money",
    name: "Viettel Money",
    icon: "VIETELMONEY.png",
  },
  {
    id: "vnpt-money",
    name: "VNPT Money",
    icon: "VNPTMONEY.png",
  },
  {
    id: "google-pay",
    name: "Google Pay",
    icon: "GPAY.png",
  },
];
