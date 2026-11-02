import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { HeartIcon } from "@/common/components/DsIcon/icons";
import CarouselDots from "@/common/components/MediaCarousel/CarouselDots";
import { MOTION_EASING, MOTION_REDUCE } from "@/common/constants/motion";

/**
 * 게시물·상품 미디어 캐러셀.
 *
 * 미디어는 풀블리드(여백 0)다. 높이는 서버가 내려준 `aspectRatio`(가로/세로, 1.91 ~ 0.8)로
 * 잡는다 — 게시물마다 높이가 다르므로 고정 높이 카드로 구현하면 안 되고, 첫 사진을 받아 재기 전에
 * 자리를 잡을 수 있어야 피드가 튀지 않는다.
 *
 * 디자인 시스템 §08 미디어 더블탭 — `onDoubleTap`을 넘기면 두 번 탭할 때 중앙에 흰 하트 80px가
 * scale .4 → 1.1 → 1 후 600ms에 사라진다. 탭 제스처라 옆으로 넘기는 스크롤은 가로채지 않는다.
 */
interface MediaCarouselProps {
  imageUrls: Array<string>;
  width: number;
  /** 가로/세로 비율. 없으면 1:1 */
  aspectRatio?: number;
  dotsPlacement?: "below" | "inside";
  /** 두 번 탭 — 넘기지 않으면 하트를 띄우지 않는다(마감 게시물처럼 반응이 없어야 할 때) */
  onDoubleTap?: () => void;
}

const HEART_SIZE = 80;
/** 600ms 안에서 커지기(.4 → 1.1) · 자리 잡기(→ 1) · 머물기 · 사라지기 */
const HEART_GROW = 200;
const HEART_SETTLE = 100;
const HEART_FADE = 150;
const HEART_HOLD = 600 - HEART_GROW - HEART_SETTLE - HEART_FADE;

export default function MediaCarousel(props: MediaCarouselProps) {
  const { imageUrls, width, aspectRatio = 1, dotsPlacement = "below", onDoubleTap } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  const heartScale = useSharedValue(0.4);
  const heartOpacity = useSharedValue(0);

  const height = width / (aspectRatio || 1);

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(e.nativeEvent.contentOffset.x / width);

      setActiveIndex(prev => (prev === nextIndex ? prev : nextIndex));
    },
    [width]
  );

  const showHeart = useCallback(() => {
    heartScale.value = 0.4;
    heartScale.value = withSequence(
      withTiming(1.1, { duration: HEART_GROW, easing: MOTION_EASING.spring, reduceMotion: MOTION_REDUCE }),
      withTiming(1, { duration: HEART_SETTLE, easing: MOTION_EASING.standard, reduceMotion: MOTION_REDUCE })
    );
    // 동작 줄이기에서도 하트는 보였다 사라져야 하므로 투명도는 줄이지 않는다(확대만 생략된다)
    heartOpacity.value = 1;
    heartOpacity.value = withDelay(
      HEART_GROW + HEART_SETTLE + HEART_HOLD,
      withTiming(0, { duration: HEART_FADE, easing: MOTION_EASING.exit, reduceMotion: ReduceMotion.Never }),
      ReduceMotion.Never
    );
  }, [heartOpacity, heartScale]);

  const handleDoubleTap = useCallback(() => {
    if (!onDoubleTap) {
      return;
    }
    showHeart();
    onDoubleTap();
  }, [onDoubleTap, showHeart]);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .enabled(!!onDoubleTap)
    .runOnJS(true)
    .onEnd((_, success) => {
      if (success) {
        handleDoubleTap();
      }
    });

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [{ scale: heartScale.value }],
  }));

  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <View>
      <GestureDetector gesture={doubleTap}>
        <View>
          <FlatList
            data={imageUrls}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri, ix) => `${uri}-${ix}`}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={{ width, height }} resizeMode="cover" />
            )}
          />
          {!!onDoubleTap && (
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { alignItems: "center", justifyContent: "center" },
                heartStyle,
              ]}
            >
              {/*
                흰 사진 위에서도 보이게 — 캐러셀 안쪽 도트와 같은 방향 없는 옅은 그림자.
                iOS는 shadow*로, 안드로이드는 배경 없는 뷰에 shadow*가 안 먹어 drop-shadow 필터로 그린다
              */}
              <View
                style={Platform.select({
                  ios: {
                    shadowColor: "#000",
                    shadowOpacity: 0.25,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 0 },
                  },
                  default: {
                    filter: [
                      {
                        dropShadow: {
                          offsetX: 0,
                          offsetY: 0,
                          standardDeviation: 6,
                          color: "rgba(0,0,0,0.25)",
                        },
                      },
                    ],
                  },
                })}
              >
                <HeartIcon size={HEART_SIZE} color="#FFFFFF" filled />
              </View>
            </Animated.View>
          )}
        </View>
      </GestureDetector>
      <CarouselDots count={imageUrls.length} activeIndex={activeIndex} placement={dotsPlacement} />
    </View>
  );
}
