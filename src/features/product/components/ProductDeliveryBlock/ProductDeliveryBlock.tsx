import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { formatPrice } from "@/common/utils/formatPrice";
import { DeliveryInfo } from "@/features/product/types/product";

/**
 * 배송 블록 — 라벨 열(62px 고정) + 값 열.
 *
 * 무료배송 기준과 도서산간 할증은 배송비 아래 보조 줄(11px · #737373)로 붙인다. 배송비를
 * 한 줄로만 쓰면 결제 화면에서 금액이 달라졌을 때 어디서 붙은 값인지 되짚을 곳이 없다.
 */
interface ProductDeliveryBlockProps {
  delivery?: DeliveryInfo;
}

export default function ProductDeliveryBlock(props: ProductDeliveryBlockProps) {
  const { delivery } = props;

  if (!delivery) {
    return null;
  }

  return (
    <View className="px-14 py-16">
      <View className="flex-row" style={{ gap: 12 }}>
        <Typography
          style={{ flex: 0, flexBasis: 62, fontSize: 13, fontWeight: "600", lineHeight: 19.5 }}
          className="text-ink76"
        >
          배송정보
        </Typography>
        <Typography
          style={{ flex: 1, fontSize: 13, fontWeight: "500", lineHeight: 19.5 }}
          className="text-ink"
        >
          {delivery.shippingLeadDays}일 이내 출발 예정
        </Typography>
      </View>

      <View className="mt-5 flex-row" style={{ gap: 12 }}>
        <Typography
          style={{ flex: 0, flexBasis: 62, fontSize: 13, fontWeight: "600", lineHeight: 19.5 }}
          className="text-ink76"
        >
          배송비
        </Typography>
        <View className="min-w-0 flex-1">
          <Typography style={{ fontSize: 13, fontWeight: "500", lineHeight: 19.5 }} className="text-ink">
            {delivery.deliveryFee > 0 ? `${formatPrice(delivery.deliveryFee)}원` : "무료배송"}
          </Typography>
          {!!delivery.freeShippingThreshold && (
            <Typography style={{ fontSize: 11, lineHeight: 16.5 }} className="text-gray45">
              {formatPrice(delivery.freeShippingThreshold)}원 이상 구매시 무료배송
            </Typography>
          )}
          {delivery.remoteAreaSurcharge > 0 && (
            <Typography style={{ fontSize: 11, lineHeight: 16.5 }} className="text-gray45">
              도서산간 +{formatPrice(delivery.remoteAreaSurcharge)}원
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
}
