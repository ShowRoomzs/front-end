import { ProductCardSize } from "@/features/product/components/ProductCard/ProductCard";

export const SIZE_RATIO = 0.923;

export const SIZE_CLASSES: Record<
  ProductCardSize,
  { marketName: string; productName: string; discountRate: string; salePrice: string }
> = {
  sm: {
    marketName: "text-10 gray10",
    productName: "text-13 text-black",
    discountRate: "text-13 text-pointColor",
    salePrice: "text-13 text-black",
  },
  md: {
    marketName: "text-12 gray10",
    productName: "text-15 text-black",
    discountRate: "text-16 text-pointColor",
    salePrice: "text-16 text-black",
  },
};
