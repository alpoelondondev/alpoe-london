export type ProductType = "watch" | "jewellery";
export type StockState = "in_stock" | "sourceable";

export type WatchBrandSlug =
  | "rolex"
  | "patek-philippe"
  | "audemars-piguet"
  | "richard-mille"
  | "cartier"
  | "hublot"
  | "omega"
  | "breitling"
  | "iwc"
  | "panerai"
  | "vacheron-constantin";

export type JewelleryCategorySlug =
  | "engagement-rings"
  | "wedding-rings"
  | "mens-jewellery"
  | "bracelets"
  | "earrings"
  | "necklaces-pendants"
  | "rings";

export type Product = {
  id: string;
  type: ProductType;
  brand?: string;
  brandSlug?: WatchBrandSlug;
  category?: string;
  categorySlug?: JewelleryCategorySlug;
  model?: string;
  nickname?: string;
  slug: string;
  title: string;
  description: string;
  stockState: StockState;
  materials?: string;
  gemstones?: string;
  carat?: string;
  dial?: string;
  bezel?: string;
  caseSize?: string;
  movement?: string;
  waterResistance?: string;
  referenceNumber?: string;
  year?: string;
  condition?: string;
  bracelets?: string[];
  images: string[];
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  placeholder: boolean;
};

export type SearchIndexEntry = {
  id: string;
  type: ProductType;
  title: string;
  brand?: string;
  model?: string;
  category?: string;
  reference?: string;
  materials?: string;
  url: string;
};
