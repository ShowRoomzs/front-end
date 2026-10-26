import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";
import { StallChoice, StallChoiceResponse } from "@/features/order/types/order";

/**
 * C10-2 1d 배송 추적 정지 【잠정】 — 배송 조회 맨 위.
 *
 * - 대기(WAITING): 안내만 둔다 — 아직 행동을 받지 않는다. 며칠 뒤 고를 수 있는지는 서버 값(`daysUntilOpen`)이다.
 * - 선택 가능(OPEN): [재발송 받기] / [환불 받기] 라디오 카드(결제수단 카드와 같은 규격) + [선택하고 요청하기].
 *   고르기 전에는 버튼이 비활성이다. 선택은 한 번뿐이고 처리는 브랜드가 한다.
 * - 골랐음(CHOSEN): 시안에 없는 상태라 고른 처리와 다음 일을 한 줄로 알린다.
 *
 * 별도 「배송 이상」 상태는 두지 않는다(추적 API 문제일 가능성이 커서) — 정지 기간이 기준을 넘었을 때만 보인다.
 */
interface TrackingStallBlockProps {
  stall: StallChoiceResponse;
  isSubmitting: boolean;
  onChoose: (choice: StallChoice) => void;
}

const OPTIONS: Array<{ choice: StallChoice; label: string; description: string }> = [
  { choice: "RESHIP", label: "재발송 받기", description: "같은 상품을 다시 보내드려요" },
  { choice: "REFUND", label: "환불 받기", description: "결제한 금액을 환불해 드려요" },
];

function resolveCopy(stall: StallChoiceResponse) {
  switch (stall.state) {
    case "WAITING":
      return {
        title: "배송 추적이 멈췄습니다",
        body: stall.daysUntilOpen
          ? `택배사 정보가 업데이트되지 않고 있어요. ${stall.daysUntilOpen}일 뒤에도 움직이지 않으면 재발송 또는 환불을 선택할 수 있어요.`
          : "택배사 정보가 업데이트되지 않고 있어요. 며칠 더 움직이지 않으면 재발송 또는 환불을 선택할 수 있어요.",
      };
    case "OPEN":
      return {
        title: stall.daysStalled
          ? `배송 추적이 ${stall.daysStalled}일째 멈춰 있어요`
          : "배송 추적이 멈춰 있어요",
        body: "받지 못하셨다면 아래에서 원하는 처리를 골라주세요. 요청하면 브랜드에 바로 전달돼요.",
      };
    case "CHOSEN":
      return {
        title: stall.choiceLabel
          ? `${stall.choiceLabel} 요청을 브랜드에 전달했어요`
          : "요청을 브랜드에 전달했어요",
        body: "브랜드가 확인하고 처리해요. 처리 결과는 알림으로 알려드려요.",
      };
    default:
      return null;
  }
}

export default function TrackingStallBlock(props: TrackingStallBlockProps) {
  const { stall, isSubmitting, onChoose } = props;
  const [picked, setPicked] = useState<StallChoice | null>(null);
  const copy = resolveCopy(stall);

  if (!copy) {
    return null;
  }
  const canSubmit = !!picked && !isSubmitting;

  return (
    <View>
      <View className="mx-14 rounded-base bg-band p-14" style={{ marginTop: 16 }}>
        <View className="flex-row items-start" style={{ gap: 9 }}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ marginTop: 1 }}>
            <Circle cx={12} cy={12} r={8.5} stroke="#3C3C3C" strokeWidth={1.8} />
            <Path d="M12 7.6v5.2" stroke="#3C3C3C" strokeWidth={1.8} strokeLinecap="round" />
            <Path d="M12 16.3v.2" stroke="#3C3C3C" strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
          <View className="min-w-0 flex-1">
            <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 20.3 }} className="text-ink">
              {copy.title}
            </Typography>
            <Typography style={{ fontSize: 12.5, lineHeight: 20, marginTop: 5 }} className="text-ink76">
              {copy.body}
            </Typography>
          </View>
        </View>
      </View>

      {stall.state === "OPEN" && (
        <View className="px-14" style={{ paddingTop: 12, gap: 8 }}>
          {OPTIONS.map(option => {
            const isOn = picked === option.choice;

            return (
              <TouchableOpacity
                key={option.choice}
                onPress={() => setPicked(option.choice)}
                activeOpacity={0.6}
                className={`flex-row items-start rounded-base border-[1px] ${isOn ? "border-rose bg-roseTint" : "border-borderButton bg-white"}`}
                style={{ gap: 11, paddingVertical: 14, paddingHorizontal: 13 }}
              >
                <View
                  className="items-center justify-center rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    marginTop: 1,
                    borderWidth: 1.5,
                    borderColor: isOn ? "#F2456E" : "#DEDEE0",
                    backgroundColor: isOn ? "#F2456E" : "#FFFFFF",
                  }}
                >
                  <View
                    className="rounded-full"
                    style={{ width: 7, height: 7, backgroundColor: isOn ? "#FFFFFF" : "transparent" }}
                  />
                </View>
                <View className="min-w-0 flex-1">
                  <Typography
                    style={{ fontSize: 14.5, fontWeight: "600", lineHeight: 19.6 }}
                    className="text-ink"
                  >
                    {option.label}
                  </Typography>
                  <Typography
                    style={{ fontSize: 12.5, lineHeight: 18.75, marginTop: 4 }}
                    className="text-gray45"
                  >
                    {option.description}
                  </Typography>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => picked && onChoose(picked)}
            disabled={!canSubmit}
            activeOpacity={0.8}
            className={`h-52 items-center justify-center rounded-base ${canSubmit ? "bg-rose" : "bg-fill"}`}
            style={{ marginTop: 4 }}
          >
            <Typography
              style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }}
              className={canSubmit ? "text-white" : "text-gray71"}
            >
              선택하고 요청하기
            </Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
