import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import Typography from "@/common/components/Typography/Typography";
import { MOTION_DURATION, MOTION_EASING, MOTION_REDUCE } from "@/common/constants/motion";

/**
 * C7 상품 상세 탭 — 상세정보 · 문의 · 판매자 정보(같은 폭).
 *
 * 밑줄은 탭마다 따로 그리지 않고 하나를 두어 고른 탭으로 200ms 미끄러진다(§08 탭 밑줄).
 * 밑줄 잉크 2px · 활성 14/600 잉크 · 비활성 14/400 #8E8E8E.
 *
 * 상세정보 본문이 WebView라, 안드로이드에서는 네이티브 뷰 순서상 WebView가 이 줄 위로
 * 올라와 탭이 눌리지 않는다. zIndex(iOS)와 elevation(Android)으로 위에 고정한다.
 */
interface ProductDetailTabBarProps<T extends string> {
  tabs: Array<{ id: T; label: string }>;
  selectedId: T;
  onSelect: (id: T) => void;
}

const UNDERLINE_HEIGHT = 2;

export default function ProductDetailTabBar<T extends string>(props: ProductDetailTabBarProps<T>) {
  const { tabs, selectedId, onSelect } = props;
  const [barWidth, setBarWidth] = useState(0);
  const selectedIndex = Math.max(
    tabs.findIndex(tab => tab.id === selectedId),
    0
  );
  const tabWidth = tabs.length > 0 ? barWidth / tabs.length : 0;

  const translateX = useSharedValue(selectedIndex * tabWidth);

  useEffect(() => {
    translateX.value = withTiming(selectedIndex * tabWidth, {
      duration: MOTION_DURATION.base,
      easing: MOTION_EASING.standard,
      reduceMotion: MOTION_REDUCE,
    });
  }, [selectedIndex, tabWidth, translateX]);

  const underlineStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  return (
    <View
      className="flex-row border-b-[0.5px] border-divider bg-white"
      style={{ zIndex: 2, elevation: 2 }}
      onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
    >
      {tabs.map(tab => {
        const isActive = tab.id === selectedId;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onSelect(tab.id)}
            activeOpacity={0.55}
            className="h-46 flex-1 items-center justify-center"
          >
            <Typography
              style={{ fontSize: 14, fontWeight: isActive ? "600" : "400", lineHeight: 14 }}
              className={isActive ? "text-ink" : "text-gray55"}
            >
              {tab.label}
            </Typography>
          </TouchableOpacity>
        );
      })}

      {tabWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          className="absolute bottom-0 left-0 bg-ink"
          style={[{ width: tabWidth, height: UNDERLINE_HEIGHT }, underlineStyle]}
        />
      )}
    </View>
  );
}
