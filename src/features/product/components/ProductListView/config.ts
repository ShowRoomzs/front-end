import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const PADDING_HORIZONTAL = 15;
export const PADDING_BLOCK = 25;
export const GAP = 20;
export const SCROLL_THRESHOLD = 50;

export const getCardWidth = (numColumns: number) => {
  return (SCREEN_WIDTH - PADDING_HORIZONTAL * numColumns - GAP) / numColumns;
};
