import { Dimensions } from "react-native";

export const MARKET_POPULAR_PRODUCTS_PADDING_HORIZONTAL = 15;
export const MARKET_POPULAR_PRODUCTS_GAP = 6;
export const MARKET_POPULAR_PRODUCTS_NUM_OF_RENDER = 3;

// 아이템 width : 전체 width - 좌우 padding - 아이템간 간격 / 컬럼 수
export const MARKET_POPULAR_PRODUCT_WIDTH =
  (Dimensions.get("window").width -
    MARKET_POPULAR_PRODUCTS_PADDING_HORIZONTAL * 2 -
    MARKET_POPULAR_PRODUCTS_GAP * (MARKET_POPULAR_PRODUCTS_NUM_OF_RENDER - 1)) /
  MARKET_POPULAR_PRODUCTS_NUM_OF_RENDER;
