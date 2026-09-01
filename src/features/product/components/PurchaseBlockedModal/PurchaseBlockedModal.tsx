import { Modal, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";
import { ProductSaleState } from "@/features/product/utils/saleState";

/**
 * 결제 직전 차단 (시안 C7).
 *
 * 재고·마감 판정은 **서버가** 한다. 클라이언트가 캐시된 재고로 미리 막으면 시간 오차만큼
 * 이미 닫힌 주문이 열리거나, 살 수 있는 상품이 잠긴다.
 *
 * 품절과 마감을 다른 모달로 두는 이유는 **돌아갈 길이 다르기** 때문이다 — 품절은 옵션 단위라
 * 다른 조합이 남아 있을 수 있어 [다른 옵션 고르기]가 주액션이고 옵션 시트를 다시 연다.
 * 마감은 상품 자체가 끝나 되돌릴 길이 없으므로 [확인] 하나로 닫는다.
 *
 * 두 모달 모두 **"결제는 이루어지지 않았습니다"**를 본문에 넣는다 — 돈이 중간에 빠져나갔는지가
 * 실패 순간 가장 먼저 궁금한 정보다.
 */
interface PurchaseBlockedModalProps {
  /** null이면 닫혀 있다 */
  blockedBy: Exclude<ProductSaleState, "ON_SALE"> | null;
  /** 품절 모달에만 — 방금 고른 옵션을 취소선으로 되짚어 준다 */
  optionLabel?: string;
  onClose: () => void;
  /** 품절이면 옵션 시트를 다시 연다 */
  onPickAnotherOption: () => void;
}

/** 시안의 시계 아이콘 22 · #8E8E8E — "타이밍 때문에 막혔다"를 한 컷으로 말한다 */
function ClockIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 6v6l4 2" stroke="#8E8E8E" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={12} r={8.5} stroke="#8E8E8E" strokeWidth={1.8} />
    </Svg>
  );
}

export default function PurchaseBlockedModal(props: PurchaseBlockedModalProps) {
  const { blockedBy, optionLabel, onClose, onPickAnotherOption } = props;

  const isSoldOut = blockedBy === "SOLD_OUT";

  return (
    <Modal visible={blockedBy !== null} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/45 px-32">
        <View className="w-full overflow-hidden rounded-base bg-white">
          <View className="items-center px-22 pb-20 pt-26">
            <View className="mb-14 size-44 items-center justify-center rounded-full bg-fill">
              <ClockIcon />
            </View>

            <Typography
              style={{ fontSize: 16.5, fontWeight: "700", lineHeight: 24.75, letterSpacing: -0.3 }}
              className="text-center text-ink"
            >
              {isSoldOut ? "방금 품절되었어요" : "주문이 완료되지 않았어요"}
            </Typography>

            <Typography
              style={{ fontSize: 13, lineHeight: 22.1, marginTop: 9 }}
              className="text-center text-gray45"
            >
              {isSoldOut
                ? "결제를 진행하는 사이에 선택한 옵션이 모두 팔렸어요. 결제는 이루어지지 않았습니다."
                : "결제를 진행하는 사이에 공동구매가 마감되어 주문할 수 없어요. 결제는 이루어지지 않았습니다."}
            </Typography>

            {/* 무엇이 사라졌는지 취소선으로 되짚는다 — 문장만으로는 어떤 조합이었는지 남지 않는다 */}
            {isSoldOut && !!optionLabel && (
              <View className="mt-14 w-full rounded-base bg-band px-13 py-11">
                <Typography
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                    lineHeight: 18.2,
                    textDecorationLine: "line-through",
                  }}
                  className="text-gray55"
                >
                  {optionLabel}
                </Typography>
              </View>
            )}
          </View>

          <View className="flex-row px-18 pb-18" style={{ gap: 8 }}>
            {isSoldOut && (
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.75}
                className="h-48 flex-1 flex-row items-center justify-center rounded-base border border-gray3 bg-white"
              >
                <Typography
                  style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }}
                  className="text-ink76"
                >
                  닫기
                </Typography>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={isSoldOut ? onPickAnotherOption : onClose}
              activeOpacity={0.75}
              className="h-48 flex-1 flex-row items-center justify-center rounded-base bg-rose"
            >
              <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }} className="text-white">
                {isSoldOut ? "다른 옵션 고르기" : "확인"}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
