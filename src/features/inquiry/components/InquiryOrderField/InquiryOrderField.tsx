import { BottomSheetView } from "@gorhom/bottom-sheet";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChevronRightIcon, EmptyBagIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import InquiryFieldLabel from "@/features/inquiry/components/InquiryFieldLabel/InquiryFieldLabel";

/**
 * C12 문의 작성의 [관련 주문 (선택)] — **아직 고를 수 없다.**
 *
 * 서버는 문의에 `orderId`를 받고 목록·상세에 주문 요약을 내려주지만, 소비자 앱에 **주문 목록
 * 조회 API가 없어** 선택 시트를 채울 수가 없다.
 *
 * 칸을 지우지 않고 남기는 이유는 임시 화면(주문 내역 · 취소/환불 · 알림)과 같다 — 없어진 줄 알고
 * 문의가 들어오는 것보다 "준비 중"이라고 말해 주는 편이 낫다. 눌리지 않는 회색 칸으로 두지 않고
 * 시트를 열어 사정을 밝히는 것도 같은 이유다. 주문 API가 붙으면 이 시트만 실제 목록으로 갈아 끼운다.
 */
const ORDER_SHEET_ID = "inquiry-order";
const MIN_BOTTOM_PADDING = 20;

export default function InquiryOrderField() {
  const { close } = useBottomSheetContext();

  const { open } = useBottomSheet({
    id: ORDER_SHEET_ID,
    render: <InquiryOrderComingSoonSheet onPressClose={close} />,
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  return (
    <View>
      <InquiryFieldLabel label="관련 주문" optional />

      <TouchableOpacity
        onPress={open}
        activeOpacity={0.6}
        className="h-48 flex-row items-center justify-between rounded-base border-[1px] border-borderButton px-13"
        style={{ marginTop: 9 }}
      >
        <Typography style={{ fontSize: 15, lineHeight: 15 }} className="text-gray71">
          주문 내역에서 선택
        </Typography>
        <ChevronRightIcon size={15} color="#C7C7C7" />
      </TouchableOpacity>

      <Typography style={{ fontSize: 11.5, lineHeight: 18.4, marginTop: 8 }} className="text-gray45">
        주문을 연결하면 배송·환불 확인이 더 빨라요
      </Typography>
    </View>
  );
}

interface InquiryOrderComingSoonSheetProps {
  onPressClose: () => void;
}

function InquiryOrderComingSoonSheet(props: InquiryOrderComingSoonSheetProps) {
  const { onPressClose } = props;
  const { bottom } = useSafeAreaInsets();

  return (
    <BottomSheetView style={{ paddingBottom: Math.max(bottom, MIN_BOTTOM_PADDING) }}>
      <Typography
        style={{ fontSize: 15, fontWeight: "600", lineHeight: 21 }}
        className="px-20 pb-12 text-center text-ink"
      >
        관련 주문 선택
      </Typography>

      <View className="items-center px-20" style={{ paddingTop: 10, paddingBottom: 24 }}>
        <EmptyBagIcon size={50} />
        <Typography
          style={{ fontSize: 15, fontWeight: "600", lineHeight: 22.5, marginTop: 16 }}
          className="text-center text-ink"
        >
          주문 내역을 준비하고 있어요
        </Typography>
        <Typography
          style={{ fontSize: 12.5, lineHeight: 20, marginTop: 6 }}
          className="text-center text-gray45"
        >
          {"준비가 끝나면 주문을 연결해\n더 빠르게 확인해 드릴게요"}
        </Typography>
      </View>

      <View className="border-t-[0.5px] border-divider px-20 pt-14">
        <TouchableOpacity
          onPress={onPressClose}
          activeOpacity={0.6}
          className="h-48 flex-row items-center justify-center rounded-base border-[1px] border-borderButton"
        >
          <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }} className="text-ink76">
            주문 없이 문의하기
          </Typography>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
}
