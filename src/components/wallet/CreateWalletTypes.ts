export type AssetType = "cash" | "bank" | "ewallet" | "card";

export interface SelectedAsset {
  type: AssetType;
  id?: string;
  name?: string;
  icon?: string;
}
