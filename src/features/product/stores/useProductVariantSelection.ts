import { createStore } from "@/common/stores/createStore";
import { LocalVariant } from "@/features/product/types/product";

interface ProductVariantSelectionStore {
  selectedVariantsByProductId: Record<number, Array<LocalVariant>>;
  setSelectedVariants: (productId: number, variants: Array<LocalVariant>) => void;
  clearSelectedVariants: (productId: number) => void;
}

export const useProductVariantSelection = createStore<ProductVariantSelectionStore>({
  creator: set => ({
    selectedVariantsByProductId: {},
    setSelectedVariants: (productId, variants) =>
      set(state => {
        state.selectedVariantsByProductId[productId] = variants;
      }),
    clearSelectedVariants: productId =>
      set(state => {
        delete state.selectedVariantsByProductId[productId];
      }),
  }),
});
