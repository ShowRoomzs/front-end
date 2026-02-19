import { Dimensions } from "react-native";

export const MARKET_PRODUCT_LIST_PADDING = 20;
export const MARKET_PRODUCT_LIST_NUM_COLUMNS = 2;
export const MARKET_PRODUCT_LIST_GAP = 10;

export const MARKET_PRODUCT_LIST_ITEM_WIDTH =
  (Dimensions.get("window").width -
    MARKET_PRODUCT_LIST_PADDING * 2 -
    MARKET_PRODUCT_LIST_GAP * (MARKET_PRODUCT_LIST_NUM_COLUMNS - 1)) /
  MARKET_PRODUCT_LIST_NUM_COLUMNS;
