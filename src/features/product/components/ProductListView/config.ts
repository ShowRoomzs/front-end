import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const PADDING_HORIZONTAL = 15;
export const GAP = 20;
export const CARD_WIDTH = (SCREEN_WIDTH - PADDING_HORIZONTAL * 2 - GAP) / 2;
export const SCROLL_THRESHOLD = 50;
