import { useCallback, useEffect, useMemo, useRef } from "react";
import { LayoutChangeEvent, useWindowDimensions, View, ViewStyle } from "react-native";
import { StyleProp } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { clamp, runOnJS, useSharedValue, withTiming } from "react-native-reanimated";

import {
  CONTENT_SCROLL_OFFSET,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_MOUNTED_COUNT,
  SCROLL_ENABLE_VELOCITY,
} from "@/common/components/Tabs/config";
import TabContent from "@/common/components/Tabs/TabContent";
import TabItem from "@/common/components/Tabs/TabItem";
import { TabItemType } from "@/common/components/Tabs/Tabs";

interface TabBodyProps {
  items: Array<TabItemType>;
  selectedIndex: number;
  onChangeIndex: (index: number) => void;
  wrapperClassName?: string;
  skipIntermediateTabs?: boolean;
  enableTabTransitionAnimation?: boolean;
  enableGesture?: boolean;
  onLayout?: (key: string, e: LayoutChangeEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export default function TabBody(props: TabBodyProps) {
  const {
    items,
    onChangeIndex,
    selectedIndex,
    wrapperClassName,
    skipIntermediateTabs,
    enableTabTransitionAnimation,
    enableGesture = true,
    onLayout,
    style,
  } = props;
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const dragTranslation = useSharedValue(0);
  const memorizedDragTranslation = useSharedValue(0);
  const isSwiping = useSharedValue(false);
  const internalIndex = useRef(selectedIndex);

  useEffect(() => {
    if (selectedIndex === undefined || internalIndex.current === selectedIndex) {
      return; // 이미 동기화되어 있음 (제스처로 변경된 경우)
    }
    // 탭 클릭으로 변경된 경우 호출
    internalIndex.current = selectedIndex;
    dragTranslation.value = -SCREEN_WIDTH * selectedIndex;
    memorizedDragTranslation.value = -SCREEN_WIDTH * selectedIndex;
  }, [dragTranslation, memorizedDragTranslation, selectedIndex, SCREEN_WIDTH]);

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      internalIndex.current = newIndex;
      onChangeIndex(newIndex);
    },
    [onChangeIndex]
  );

  const getClampedTranslation = useCallback(
    (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      "worklet";
      const nextTranslation = memorizedDragTranslation.get() + event.translationX;
      const minTranslation = -SCREEN_WIDTH * (items.length - 1); // 마지막 탭까지 가능
      const maxTranslation = 0; // 첫 번째 탭까지 가능
      const clamped = clamp(nextTranslation, minTranslation, maxTranslation);

      return { nextTranslation, clamped };
    },
    [memorizedDragTranslation, SCREEN_WIDTH, items.length]
  );

  const updateDragTranslationWithAnimation = useCallback(
    (translationX: number) => {
      "worklet";

      dragTranslation.value = withTiming(
        translationX,
        {
          duration: DEFAULT_ANIMATION_DURATION,
        },
        finished => {
          if (finished) {
            isSwiping.value = false;
          }
        }
      );
      memorizedDragTranslation.value = translationX;
    },
    [dragTranslation, isSwiping, memorizedDragTranslation]
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(enableGesture)
        .onStart(() => {
          isSwiping.value = true;
        })
        .onUpdate(event => {
          const { clamped } = getClampedTranslation(event);

          dragTranslation.value = clamped;
        })
        .onEnd(event => {
          const { nextTranslation, clamped } = getClampedTranslation(event);
          const isNotOverScroll = clamped === nextTranslation; // clamp가 적용되지 않았다면 범위 내

          const isExceedScrollOffset = Math.abs(event.translationX) > SCREEN_WIDTH * CONTENT_SCROLL_OFFSET; // 스크롤 범위 임계치 초과 여부
          const isExceedVelocityOffset = Math.abs(event.velocityX) > SCROLL_ENABLE_VELOCITY; // 스크롤 속도 임계치 초과 여부
          const shouldChangeTab = isNotOverScroll && (isExceedScrollOffset || isExceedVelocityOffset);

          if (!shouldChangeTab) {
            // 원래 위치로 복귀
            updateDragTranslationWithAnimation(memorizedDragTranslation.value);
            return;
          }
          const isNext = event.translationX < 0;

          if (isNext) {
            // 다음 탭으로 이동
            const translationX = memorizedDragTranslation.value - SCREEN_WIDTH;

            updateDragTranslationWithAnimation(translationX);
            runOnJS(handleIndexChange)(selectedIndex + 1);
          } else {
            // 이전 탭으로 이동
            const translationX = memorizedDragTranslation.value + SCREEN_WIDTH;

            updateDragTranslationWithAnimation(translationX);
            runOnJS(handleIndexChange)(selectedIndex - 1);
          }
        }),
    [
      enableGesture,
      SCREEN_WIDTH,
      dragTranslation,
      getClampedTranslation,
      handleIndexChange,
      memorizedDragTranslation,
      selectedIndex,
      updateDragTranslationWithAnimation,
      isSwiping,
    ]
  );

  const initialMountedIndexes = useMemo(() => {
    return [...items].slice(0, DEFAULT_MOUNTED_COUNT).map((_, index) => index);
  }, [items]);

  const checkIsMounted = useCallback(
    (index: number) => {
      return initialMountedIndexes.includes(index) || selectedIndex === index;
    },
    [initialMountedIndexes, selectedIndex]
  );

  const handleLayoutTabBodyContent = useCallback(
    (key: string, e: LayoutChangeEvent) => {
      if (!onLayout) {
        return;
      }
      onLayout(key, e);
    },
    [onLayout]
  );

  return (
    <View style={style} className={wrapperClassName}>
      <GestureDetector gesture={pan}>
        <View className="flex-1 flex flex-row relative">
          {items.map((item, ix) => (
            <TabItem
              wrapperClassName="min-h-full"
              key={item.id}
              index={ix}
              selectedIndex={selectedIndex}
              isSwiping={isSwiping}
              translationX={dragTranslation}
              skipIntermediateTabs={skipIntermediateTabs}
              enableTabTransitionAnimation={enableTabTransitionAnimation}
            >
              <TabContent
                onLayout={e => handleLayoutTabBodyContent(item.id, e)}
                isMounted={checkIsMounted(ix)}
              >
                {item?.render?.(item.id) || null}
              </TabContent>
            </TabItem>
          ))}
        </View>
      </GestureDetector>
    </View>
  );
}
