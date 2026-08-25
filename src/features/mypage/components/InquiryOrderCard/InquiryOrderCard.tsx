import dayjs from "dayjs";
import { Image, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { InquiryOrderSummary } from "@/features/inquiry/types/inquiry";

/**
 * 문의에 연결된 주문 카드 (C12).
 *
 * 배송·환불 문의는 대부분 "어느 주문인지"부터 확인해야 하므로 문의에 주문을 붙일 수 있다.
 * 주문을 연결하지 않은 문의는 이 블록 자체를 그리지 않는다 — 서비스·계정 문의는 주문과
 * 무관해서, 빈 안내 블록이 오히려 잡음이 된다.
 *
 * 썸네일은 문의 맥락에선 보조 정보라 34(목록) · 44(상세)로 낮춘다.
 */
interface InquiryOrderCardProps {
  order: InquiryOrderSummary;
  size?: "sm" | "md";
}

export default function InquiryOrderCard(props: InquiryOrderCardProps) {
  const { order, size = "sm" } = props;
  const isSmall = size === "sm";
  const thumbSize = isSmall ? 34 : 44;

  const productName = order.productName ?? "주문 상품";
  const productLabel = order.productCount > 1 ? `${productName} 외 ${order.productCount - 1}건` : productName;

  return (
    <View
      className={`flex-row items-center rounded-base ${isSmall ? "bg-band" : "border-[1px] border-borderButton"}`}
      style={{ gap: 9, paddingHorizontal: isSmall ? 10 : 12, paddingVertical: isSmall ? 9 : 11 }}
    >
      {order.productImageUrl ? (
        <Image
          source={{ uri: order.productImageUrl }}
          style={{ width: thumbSize, height: thumbSize, borderRadius: 4 }}
        />
      ) : (
        <View className="bg-fill" style={{ width: thumbSize, height: thumbSize, borderRadius: 4 }} />
      )}

      <View className="min-w-0 flex-1">
        <Typography style={{ fontSize: 11, lineHeight: 14.3 }} className="text-gray45">
          {isSmall
            ? order.orderNumber
            : `${order.orderNumber} · ${dayjs(order.orderDate).format("YYYY.MM.DD")}`}
        </Typography>
        <Typography
          style={{
            fontSize: isSmall ? 12.5 : 13,
            lineHeight: isSmall ? 16.9 : 17.55,
            marginTop: isSmall ? 2 : 3,
          }}
          className="text-ink76"
          numberOfLines={1}
        >
          {productLabel}
        </Typography>
      </View>
    </View>
  );
}
