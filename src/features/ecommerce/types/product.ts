// Produto no formato próximo ao do exemplo fornecido
export interface ImageUrls {
  at1x?: string;
  at2x?: string;
  at3x?: string;
}

export interface PriceDefinition {
  calculatedSellingPrice: number; // em centavos
  total: number;
  sellingPrices: { quantity: number; value: number }[];
}

export interface EcommerceItem {
  additionalInfo?: { brandName?: string };
  attachments?: unknown[];
  availability?: 'available' | 'unavailable';
  detailUrl?: string;
  id: string;
  imageUrls?: ImageUrls;
  listPrice?: number; // em centavos
  measurementUnit?: string;
  name: string;
  price?: number; // em centavos
  productCategories?: Record<string, string>;
  productCategoryIds?: string;
  productRefId?: string;
  productId?: string;
  quantity?: number;
  seller?: string;
  sellingPrice?: number; // em centavos
  skuName?: string;
  unitMultiplier?: number;
  uniqueId?: string;
  refId?: string;
  isGift?: boolean;
  priceDefinition?: PriceDefinition;
}

// Tipo simples para a UI
export interface UIProduct {
  id: string;
  name: string;
  image: string;
  brand?: string;
  price: number; // em reais
  listPrice?: number; // em reais
  unit?: string;
  url?: string;
  available: boolean;
  packSize?: number; // ex.: 12
  categories?: string[]; // nomes em ordem hierárquica
  categoryPath?: { id: string; name: string }[]; // ids e nomes em ordem
}
