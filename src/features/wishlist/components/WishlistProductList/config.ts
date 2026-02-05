import { Dimensions } from "react-native";

export const WISHLIST_PRODUCT_LIST_PADDING_HORIZONTAL = 15;
export const WISHLIST_PRODUCT_LIST_PADDING_VERTICAL = 20;
export const WISHLIST_PRODUCT_LIST_NUM_OF_COLUMNS = 3;
export const WISHLIST_PRODUCT_LIST_GAP = 6;

// 아이템 width : 전체 width - 좌우 padding - 아이템간 간격 / 컬럼 수
export const WISHLIST_PRODUCT_LIST_ITEM_WIDTH =
  (Dimensions.get("window").width - // 전체 width
    WISHLIST_PRODUCT_LIST_PADDING_HORIZONTAL * 2 - // 좌우 padding
    WISHLIST_PRODUCT_LIST_GAP * (WISHLIST_PRODUCT_LIST_NUM_OF_COLUMNS - 1)) / // 아이템 간격
  WISHLIST_PRODUCT_LIST_NUM_OF_COLUMNS; // 컬럼 수
