export interface ProductVariantInput {
    name?: string;
    sku: string;
    isDefault: boolean;
    price?: number;
    priceVariants?: {
        identifier: string;
        price?: number;
    }[];
}
