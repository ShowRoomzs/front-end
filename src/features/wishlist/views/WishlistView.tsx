import { View } from "react-native";

import { useParams } from "@/common/hooks/useParams";
import { useGetWishlist } from "@/features/wishlist/hooks/useGetWishlist";
import { WishlistParams } from "@/features/wishlist/types/params";

const INITIAL_PARAMS: WishlistParams = {
  page: 1,
  limit: 10,
  categoryId: null,
};

export default function WishlistView() {
  const { params } = useParams<WishlistParams>(INITIAL_PARAMS);
  const { products } = useGetWishlist(params);

  console.log("products", products);

  return <View></View>;
}
