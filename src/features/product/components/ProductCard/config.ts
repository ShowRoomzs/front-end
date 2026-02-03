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

export const parseCount = (count: number): string => {
  if (count <= 0) {
    return "";
  }

  if (count < 1_000) {
    return String(count);
  }

  if (count < 10_000) {
    const value = count / 1_000;

    return `${value.toFixed(1)}천`;
  }

  const value = count / 10_000;

  return `${value.toFixed(1)}만`;
};
