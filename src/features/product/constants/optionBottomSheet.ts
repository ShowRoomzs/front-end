import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";

export const PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT = WINDOW_HEIGHT * 0.8;

export const PRODUCT_OPTION_BOTTOM_SHEET_PROPS = {
  enableDynamicSizing: true,
  enableContentPanningGesture: false, // 내부 콘텐츠 패닝 금지
  enableHandlePanningGesture: false, // 핸들 패닝 금지
  snapPoints: ["80%"], // 최대 높이 화면 80%
  maxDynamicContentSize: PRODUCT_OPTION_BOTTOM_SHEET_MAX_HEIGHT,
};
