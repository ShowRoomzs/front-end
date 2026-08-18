import { TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

/**
 * 주문 현황 4단계 — 칸 구분선 없이 하나의 카드(R8 외곽선)로 둔다.
 *
 * 0건은 숫자·라벨 모두 회색 + 탭 불가로 비활성화된다. 갈 곳이 없는 숫자를 누를 수 있게 두면
 * 빈 화면으로 보내게 되고, 그게 반복되면 이 카드 전체를 신뢰하지 않게 된다.
 *
 * 주문 API가 아직 없어 지금은 네 단계가 모두 0이다. 카드를 감추지 않고 남기는 이유는
 * 마이 탭의 뼈대가 주문 현황을 중심으로 짜여 있어, 빠지면 화면 구조가 달라 보이기 때문이다.
 */
export interface OrderStatusItem {
  key: string;
  label: string;
  count: number;
}

interface OrderStatusCardProps {
  items: Array<OrderStatusItem>;
  onPressStatus: () => void;
}

export default function OrderStatusCard(props: OrderStatusCardProps) {
  const { items, onPressStatus } = props;

  return (
    <View className="mx-14 flex-row rounded-base border-[1px] border-borderButton bg-white py-16">
      {items.map(item => {
        const isEmpty = item.count === 0;

        return (
          <TouchableOpacity
            key={item.key}
            onPress={onPressStatus}
            disabled={isEmpty}
            activeOpacity={0.6}
            className="flex-1 items-center"
          >
            <Typography
              style={{ fontSize: 18, fontWeight: "700", lineHeight: 22 }}
              className={isEmpty ? "text-gray62" : "text-ink"}
            >
              {item.count}
            </Typography>
            <Typography
              style={{ fontSize: 12, lineHeight: 18, marginTop: 3 }}
              className={isEmpty ? "text-gray62" : "text-ink76"}
            >
              {item.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
