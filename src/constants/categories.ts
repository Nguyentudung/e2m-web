import type { IconSvgElement } from "@hugeicons/react";
import {
  RestaurantIcon,
  DropletIcon,
  SolarEnergyIcon,
  Home01Icon,
  ShoppingCart01Icon,
  Car01Icon,
  GraduateMaleIcon,
  MedicalMaskIcon,
  GameIcon,
  SmartPhone01Icon,
  Wifi01Icon,
  Invoice01Icon,
  Airplane01Icon,
  GiftIcon,
  MoreHorizontalIcon,
  Apple01Icon,
  CandyIcon,
  ShoppingBag01Icon,
  PetrolPumpIcon,
  Money02Icon,
  Award01Icon,
  AppleStocksIcon,
  WorkflowCircle03Icon,
  Store01Icon,
  PercentCircleIcon,
  CustomerSupportIcon,
} from "@hugeicons/core-free-icons";

export type CategoryType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  icon: IconSvgElement;
  type: CategoryType;
  color: string;
}

// ============================================================
// EXPENSE CATEGORIES
// ============================================================

export const expenseCategories: Category[] = [
  { id: "food", name: "Ăn uống", icon: RestaurantIcon, type: "expense", color: "var(--chart-4)" },
  { id: "water", name: "Nước", icon: DropletIcon, type: "expense", color: "var(--chart-2)" },
  { id: "electricity", name: "Điện", icon: SolarEnergyIcon, type: "expense", color: "var(--chart-1)" },
  { id: "rent", name: "Tiền nhà", icon: Home01Icon, type: "expense", color: "var(--chart-3)" },
  { id: "vegetables", name: "Rau củ", icon: Apple01Icon, type: "expense", color: "var(--chart-3)" },
  { id: "fruits", name: "Trái cây", icon: Apple01Icon, type: "expense", color: "var(--chart-4)" },
  { id: "snacks", name: "Đồ ăn vặt", icon: CandyIcon, type: "expense", color: "var(--chart-1)" },
  { id: "shopping", name: "Mua sắm", icon: ShoppingBag01Icon, type: "expense", color: "var(--chart-2)" },
  { id: "transport", name: "Đi lại", icon: Car01Icon, type: "expense", color: "var(--chart-3)" },
  { id: "gas", name: "Xăng xe", icon: PetrolPumpIcon, type: "expense", color: "var(--chart-4)" },
  { id: "education", name: "Giáo dục", icon: GraduateMaleIcon, type: "expense", color: "var(--chart-2)" },
  { id: "health", name: "Y tế", icon: MedicalMaskIcon, type: "expense", color: "var(--chart-3)" },
  { id: "entertainment", name: "Giải trí", icon: GameIcon, type: "expense", color: "var(--chart-1)" },
  { id: "phone", name: "Điện thoại", icon: SmartPhone01Icon, type: "expense", color: "var(--chart-2)" },
  { id: "internet", name: "Internet", icon: Wifi01Icon, type: "expense", color: "var(--chart-3)" },
  { id: "bills", name: "Hóa đơn", icon: Invoice01Icon, type: "expense", color: "var(--chart-4)" },
  { id: "travel", name: "Du lịch", icon: Airplane01Icon, type: "expense", color: "var(--chart-2)" },
  { id: "gift_out", name: "Quà tặng", icon: GiftIcon, type: "expense", color: "var(--chart-4)" },
  { id: "groceries", name: "Tạp hóa", icon: ShoppingCart01Icon, type: "expense", color: "var(--chart-3)" },
  { id: "other_expense", name: "Khác", icon: MoreHorizontalIcon, type: "expense", color: "var(--chart-5)" },
];

// ============================================================
// INCOME CATEGORIES
// ============================================================

export const incomeCategories: Category[] = [
  { id: "salary", name: "Lương", icon: Money02Icon, type: "income", color: "var(--chart-3)" },
  { id: "bonus", name: "Thưởng", icon: Award01Icon, type: "income", color: "var(--chart-1)" },
  { id: "gift_in", name: "Quà tặng", icon: GiftIcon, type: "income", color: "var(--chart-4)" },
  { id: "dividend", name: "Cổ tức", icon: AppleStocksIcon, type: "income", color: "var(--chart-2)" },
  { id: "investment", name: "Đầu tư", icon: AppleStocksIcon, type: "income", color: "var(--chart-2)" },
  { id: "freelance", name: "Công việc", icon: WorkflowCircle03Icon, type: "income", color: "var(--chart-1)" },
  { id: "sales", name: "Bán hàng", icon: Store01Icon, type: "income", color: "var(--chart-2)" },
  { id: "refund", name: "Hoàn tiền", icon: PercentCircleIcon, type: "income", color: "var(--chart-3)" },
  { id: "subsidy", name: "Trợ cấp", icon: CustomerSupportIcon, type: "income", color: "var(--chart-1)" },
  { id: "other_income", name: "Khác", icon: MoreHorizontalIcon, type: "income", color: "var(--chart-5)" },
];

// ============================================================
// ALL CATEGORIES
// ============================================================

export const allCategories: Category[] = [...expenseCategories, ...incomeCategories];

export function getCategoryById(id: string): Category | undefined {
  return allCategories.find((c) => c.id === id);
}

export function getCategoriesByType(type: CategoryType): Category[] {
  return allCategories.filter((c) => c.type === type);
}
