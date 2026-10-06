import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { ChevronLine, OutlineAction, ProductLine } from "@/features/order/components/OrderParts/OrderParts";
import { OrderItemAction, OrderItemRow } from "@/features/order/types/order";
import { optionWithQuantity } from "@/features/order/utils/orderFormat";

/**
 * 주문 항목 한 줄 — C10 주문 내역(`list`)과 C10-1 주문 상세(`detail`)가 같이 쓴다.
 *
 * **상태는 칩이 아니라 글씨**다 — 한 화면에 상태가 6~7번 반복되는 목록에서 칩을 쓰면 상품보다
 * 배지가 먼저 읽힌다. 굵기는 13/700로 통일하고 색으로만 층을 나눈다: 로즈 = 지금 볼·할 것이
 * 있는 상태, #737373 = 개입할 수 없는 상태. 라벨·색·보조 문구·버튼은 서버가 내린다.
 *
 * 상태 아래 한 줄은 두 종류다 — 로즈 **할 일**(회수 송장 등록 · 재발송비 결제, 기한 포함)과 회색
 * **반려 이력**(「취소 요청 반려 · 사유 보기」). 로즈는 행동이 필요할 때만 쓴다.
 *
 * 취소·반품·반품교환 진행 행은 **탈색**한다(썸네일 불투명도 · 상품명·금액 #9E9E9E). 탈색된 행에도
 * [○○ 상세] 버튼은 남긴다 — 환불액·회수 일정은 가장 자주 확인하는 정보이고 이 행이 유일한 진입이다.
 *
 * 목록은 상태 우측에 보조 문구를 「· 」로 잇고 버튼을 한 줄(최대 2개)로, 상세는 보조 문구를 오른쪽
 * 끝에 두고 버튼을 2열로 감싼다(최대 3개).
 */
interface OrderItemCardProps {
  item: OrderItemRow;
  variant: "list" | "detail";
  isFirst: boolean;
  onPressAction: (action: OrderItemAction) => void;
  /** 할 일 줄 · 반품·교환 반려 줄 — 반품·교환 상세로 */
  onPressClaim: (claimId: number) => void;
  /** 「취소 요청 반려 · 사유 보기」 — 취소 상세로 */
  onPressCancelRejection: (cancelRequestId: number) => void;
}

const TONE_COLOR = { ACTIVE: "#F2456E", MUTED: "#737373" } as const;

export default function OrderItemCard(props: OrderItemCardProps) {
  const { item, variant, isFirst, onPressAction, onPressClaim, onPressCancelRejection } = props;
  const isList = variant === "list";

  const statusColor = TONE_COLOR[item.statusTone];
  const claimRejectionLabel = item.claimRejection
    ? `${item.claimRejection.type === "EXCHANGE" ? "교환" : "반품"} 요청 반려 · 사유 보기`
    : null;

  const lines = (
    <>
      {/* 취소 반려 — 상태는 실제 상태(배송중 등) 그대로 두고 회색 한 줄로 이력만 남긴다 */}
      {!!item.cancelRejection && !item.claimRejection && (
        <ChevronLine
          label="취소 요청 반려 · 사유 보기"
          tone="gray"
          onPress={() => onPressCancelRejection(item.cancelRejection!.cancelRequestId)}
          style={isList ? { marginTop: 2, marginBottom: -4 } : { marginTop: 4, marginBottom: -2 }}
        />
      )}
      {!!claimRejectionLabel && item.claimRejection && (
        <ChevronLine
          label={claimRejectionLabel}
          tone="gray"
          onPress={() => onPressClaim(item.claimRejection!.claimId)}
          style={isList ? { marginTop: 2, marginBottom: -4 } : { marginTop: 4, marginBottom: -2 }}
        />
      )}
      {!!item.todo && (
        <ChevronLine
          label={item.todo.label}
          tone="rose"
          onPress={() => onPressClaim(item.todo!.claimId)}
          style={isList ? { marginTop: 2, marginBottom: -4 } : { marginTop: 4, marginBottom: -2 }}
        />
      )}
    </>
  );

  const product = (
    <ProductLine
      thumbnailUrl={item.thumbnailUrl}
      brand={item.brandName}
      name={item.productName}
      option={
        item.returnedQuantity > 0
          ? `${optionWithQuantity(item.optionName, item.quantity)} (반품 ${item.returnedQuantity}개)`
          : optionWithQuantity(item.optionName, item.quantity)
      }
      price={item.amountLabel}
      dimmed={item.dimmed}
      priceWeight={item.dimmed ? "400" : "700"}
    />
  );

  if (isList) {
    return (
      <View
        className="px-14"
        style={isFirst ? undefined : { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" }}
      >
        <View className="flex-row items-center" style={{ gap: 6, paddingTop: 13 }}>
          <Typography style={{ fontSize: 13, fontWeight: "700", lineHeight: 16.9, color: statusColor }}>
            {item.statusLabel}
          </Typography>
          {!!item.statusSub && (
            <Typography
              style={{ fontSize: 12, lineHeight: 15.6 }}
              className="min-w-0 flex-1 text-gray45"
              numberOfLines={1}
            >
              · {item.statusSub}
            </Typography>
          )}
        </View>
        {lines}
        <View style={{ paddingTop: 11, paddingBottom: 14 }}>{product}</View>
        {item.actions.length > 0 && (
          <View className="flex-row" style={{ gap: 7, paddingBottom: 14 }}>
            {item.actions.map(action => (
              <OutlineAction
                key={action.type}
                label={action.label}
                disabled={!action.enabled}
                onPress={() => onPressAction(action)}
              />
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      className="px-14 py-16"
      style={isFirst ? undefined : { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" }}
    >
      <View className="flex-row items-center justify-between" style={{ gap: 10 }}>
        <Typography style={{ fontSize: 13, fontWeight: "700", lineHeight: 16.9, color: statusColor }}>
          {item.statusLabel}
        </Typography>
        {!!item.statusSub && (
          <Typography style={{ fontSize: 11.5, lineHeight: 15 }} className="text-gray45">
            {item.statusSub}
          </Typography>
        )}
      </View>
      {lines}
      <View style={{ marginTop: 12 }}>{product}</View>
      {item.actions.length > 0 && (
        <View className="flex-row flex-wrap" style={{ marginTop: 12, gap: 7 }}>
          {item.actions.map(action => (
            <OutlineAction
              key={action.type}
              label={action.label}
              disabled={!action.enabled}
              onPress={() => onPressAction(action)}
              // 2열 — 세 개면 2+1로 감싼다
              style={{ flexBasis: "48%", flexGrow: 1 }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
