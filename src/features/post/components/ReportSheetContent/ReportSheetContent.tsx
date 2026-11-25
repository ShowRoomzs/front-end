import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Keyboard, LayoutChangeEvent, Platform, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CheckIcon } from "@/common/components/DsIcon/icons";
import PressableRow from "@/common/components/PressableRow/PressableRow";
import TextArea from "@/common/components/TextArea/TextArea";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
import { useGetReportReasons } from "@/features/post/hooks/useGetReportReasons";
import { useReportPostMutation } from "@/features/post/hooks/useReportPostMutation";
import { PostReportReasonCode } from "@/features/post/types/post";

/**
 * C18 게시물 신고 사유 — 게시물 ⋯ 시트의 [게시물 신고]에서 이어진다.
 *
 * **한 시트 안에서 끝낸다.** 사유는 하나만 고르고(복수 신고는 분석을 흐린다) 로즈 체크로 표시하며,
 * 접수는 [신고 접수]로만 한다 — 사유를 누르자마자 접수되면 잘못 누른 신고를 되돌릴 길이 없다.
 * 상세 입력이 필요한 사유(기타)를 고르면 목록 바로 아래에 입력칸이 펼쳐지고 시트 높이만 늘어난다.
 *
 * 사유 목록은 서버가 내려준 것을 그대로 쓴다. 앱이 문구를 들고 있으면 운영정책이 바뀔 때마다
 * 앱을 다시 배포해야 한다. 기타는 상세 설명 없이 접수하지 않는다 — 운영자가 무엇을 보라는
 * 것인지 알 수 없는 신고는 조치로 이어지지 않고 대기열만 채운다.
 *
 * **키보드는 이 시트가 직접 다룬다.** 기타를 펼친 시트는 약 600dp라 키보드 위 남는 공간보다 크다.
 * 시트 라이브러리의 키보드 처리(BottomSheetTextInput)는 키보드가 뜰 때 한 번만 위치를 정해, 그 뒤
 * 내용을 줄여도 시트가 화면 위끝에 붙은 채 제목이 상태 표시줄 밑으로 들어갔다(실기기 SM-S931N).
 * 그래서 입력칸은 일반 TextInput으로 두고(라이브러리는 키보드를 무시한다), 키보드가 뜨면 버튼 아래에
 * 키보드 높이만큼 빈칸을 넣어 시트를 키우고, 가운데(사유 + 입력칸)는 남는 높이로 묶어 입력칸이 보이게
 * 끝까지 내린다. 제목과 버튼은 고정이다(시안에 키보드 상태가 없어 실기기로 정함).
 *
 * 시안 값: 제목 15.5/600 · 안내 12.5/1.6 #737373 · 행 안쪽 15/20 · 라벨 14.5/1.4(선택 600 잉크 ·
 * 비선택 400 #3C3C3C) · 선택 행 배경 #FEF4F6 · 체크 로즈 18 · 상세 라벨 12.5/600 + 글자 수 11.5 ·
 * 버튼 52 R8 15.5/600 · 시트 아래 20.
 */
interface ReportSheetContentProps {
  postId: number;
  onClose: () => void;
}

/** 시안 C18 — 상세 사유는 200자까지(서버 한도 500 안쪽) */
const DETAIL_MAX_LENGTH = 200;
const MIN_BOTTOM_PADDING = 20;
/** 시트 핸들 영역 — BottomSheet 기본값(위 10 + 막대 4 + 아래 12) */
const SHEET_HANDLE_HEIGHT = 26;
/** 키보드가 떴을 때 시트 위끝과 상태 표시줄 사이 여백 */
const TOP_GAP_WITH_KEYBOARD = 8;
const ROW_DIVIDER = { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } as const;

export default function ReportSheetContent(props: ReportSheetContentProps) {
  const { postId, onClose } = props;
  const { top, bottom } = useSafeAreaInsets();
  const { data: reasons } = useGetReportReasons();
  const { mutate: report, isPending } = useReportPostMutation();

  const [selectedCode, setSelectedCode] = useState<PostReportReasonCode | null>(null);
  const [detail, setDetail] = useState("");

  const scrollRef = useRef<ScrollView>(null);
  /** 키보드 위끝의 화면 y — 키보드가 없으면 null */
  const [keyboardTop, setKeyboardTop] = useState<number | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    // iOS는 키보드와 같이 움직이도록 Will, 안드로이드는 Will 이벤트가 없어 Did
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSubscription = Keyboard.addListener(showEvent, event =>
      setKeyboardTop(event.endCoordinates.screenY)
    );
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardTop(null));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const isKeyboardShown = keyboardTop !== null;
  /** 키보드가 화면 아래에서 덮는 높이 — 시트 아래에 이만큼 빈칸을 넣어 내용을 키보드 위로 올린다 */
  const keyboardInset = isKeyboardShown ? Math.max(0, Dimensions.get("screen").height - keyboardTop) : 0;

  // 가운데를 줄인 뒤 입력칸이 보이게 끝까지 내린다 — 입력칸은 가운데의 맨 아래에 있다
  useEffect(() => {
    if (!isKeyboardShown) {
      return;
    }
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);

    return () => clearTimeout(timer);
  }, [isKeyboardShown]);

  const middleMaxHeight = isKeyboardShown
    ? Math.max(
        0,
        keyboardTop - top - TOP_GAP_WITH_KEYBOARD - SHEET_HANDLE_HEIGHT - headerHeight - footerHeight
      )
    : undefined;

  const selected = reasons?.find(reason => reason.code === selectedCode);
  const needsDetail = !!selected?.detailRequired;
  const canSubmit = !!selected && (!needsDetail || detail.trim().length > 0) && !isPending;

  const submit = () => {
    if (!selected || !canSubmit) {
      return;
    }
    report(
      { postId, body: { reasonCode: selected.code, reasonDetail: needsDetail ? detail.trim() : undefined } },
      {
        onSuccess: () => {
          onClose();
          toast.success("신고가 접수되었어요");
        },
        onError: () => toast.error("신고를 접수하지 못했어요. 잠시 후 다시 시도해 주세요"),
      }
    );
  };

  return (
    <BottomSheetView>
      <View onLayout={(event: LayoutChangeEvent) => setHeaderHeight(event.nativeEvent.layout.height)}>
        <Typography
          style={{ fontSize: 15.5, fontWeight: "600", lineHeight: 21.7, paddingBottom: 4 }}
          className="px-20 text-ink"
        >
          이 게시물을 신고하는 이유
        </Typography>
        <Typography
          style={{ fontSize: 12.5, lineHeight: 20, paddingTop: 4, paddingBottom: 12 }}
          className="px-20 text-gray45"
        >
          신고 내용은 운영팀이 확인하며, 상대에게 알리지 않아요.
        </Typography>
      </View>

      {/*
        BottomSheetScrollView는 쓰지 않는다 — 자기 스크롤 높이(사유 목록)를 시트 높이로 덮어써 제목 · 버튼이
        화면 아래로 잘린다(문의 관련 주문 시트와 같은 문제). 일반 스크롤이면 시트는 BottomSheetView 전체를 잰다.
      */}
      <ScrollView
        ref={scrollRef}
        style={middleMaxHeight !== undefined ? { maxHeight: middleMaxHeight } : undefined}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={isKeyboardShown}
      >
        {(reasons ?? []).map(reason => {
          const isSelected = reason.code === selectedCode;

          return (
            <PressableRow
              key={reason.code}
              onPress={() => setSelectedCode(reason.code)}
              className="flex-row items-center justify-between px-20"
              style={{
                gap: 12,
                paddingVertical: 15,
                ...ROW_DIVIDER,
                ...(isSelected ? { backgroundColor: "#FEF4F6" } : null),
              }}
            >
              <Typography
                style={{ fontSize: 14.5, fontWeight: isSelected ? "600" : "400", lineHeight: 20.3 }}
                className={`min-w-0 flex-1 ${isSelected ? "text-ink" : "text-ink76"}`}
              >
                {reason.label}
              </Typography>
              <CheckIcon size={18} style={{ opacity: isSelected ? 1 : 0 }} />
            </PressableRow>
          );
        })}

        {needsDetail && (
          <View className="px-20" style={{ paddingTop: 14, ...ROW_DIVIDER }}>
            <View className="flex-row items-baseline justify-between">
              <Typography
                style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 }}
                className="text-ink76"
              >
                어떤 점이 문제인가요?
              </Typography>
              <Typography style={{ fontSize: 11.5, lineHeight: 11.5 }} className="text-gray45">
                {detail.length}/{DETAIL_MAX_LENGTH}
              </Typography>
            </View>
            <View style={{ marginTop: 9 }}>
              <TextArea
                showCounter={false}
                value={detail}
                onChangeText={setDetail}
                maxLength={DETAIL_MAX_LENGTH}
                placeholder="신고하려는 내용을 구체적으로 적어주세요"
              />
            </View>
          </View>
        )}
      </ScrollView>

      <View
        onLayout={(event: LayoutChangeEvent) => setFooterHeight(event.nativeEvent.layout.height)}
        className="px-20"
        style={{
          paddingTop: 16,
          // 키보드가 떠 있으면 버튼 아래는 키보드라 홈 인디케이터 여백이 필요 없다
          paddingBottom: isKeyboardShown ? MIN_BOTTOM_PADDING : Math.max(bottom, MIN_BOTTOM_PADDING),
        }}
      >
        <TouchableOpacity onPress={submit} disabled={!canSubmit} activeOpacity={0.75}>
          <View
            className={`h-52 flex-row items-center justify-center rounded-base ${canSubmit ? "bg-rose" : "bg-fill"}`}
          >
            <Typography variant="buttonPrimary" className={canSubmit ? "text-white" : "text-gray71"}>
              신고 접수
            </Typography>
          </View>
        </TouchableOpacity>
      </View>
      {/* 키보드가 덮는 만큼의 빈칸 — 버튼 칸(footerHeight)과 따로 둬야 가운데 높이 계산에 두 번 빠지지 않는다 */}
      {keyboardInset > 0 && <View style={{ height: keyboardInset }} />}
    </BottomSheetView>
  );
}
