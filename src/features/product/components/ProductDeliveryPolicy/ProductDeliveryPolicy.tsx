import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { formatPrice } from "@/common/utils/formatPrice";
import { DeliveryInfo } from "@/features/product/types/product";

/**
 * 배송 / 교환 / 반품 안내 — 판매자 정보 탭의 두 번째 섹션.
 *
 * 표가 아니라 **제목 + 문장** 묶음이다. 배송비처럼 조건이 붙는 값은 한 칸에 넣으면 줄이 접혀
 * 읽기 어렵고, "3,000원(30,000원 이상 무료) · 제주 +3,000원"처럼 한 문장으로 읽히는 편이 낫다.
 *
 * 청약철회 제한 문구는 흰 블록으로 따로 뗐다 — 위의 네 줄은 이 상품의 조건이고, 이건 법으로
 * 정해진 공통 고지라 출처가 다르다.
 */
interface ProductDeliveryPolicyProps {
  delivery: DeliveryInfo | undefined;
}

export default function ProductDeliveryPolicy(props: ProductDeliveryPolicyProps) {
  const { delivery } = props;

  if (!delivery) {
    return null;
  }

  const shippingLine = [
    `택배 · 배송비 ${formatPrice(delivery.deliveryFee)}원`,
    delivery.freeShippingThreshold ? `${formatPrice(delivery.freeShippingThreshold)}원 이상 무료` : null,
    delivery.remoteAreaSurcharge ? `도서산간 +${formatPrice(delivery.remoteAreaSurcharge)}원` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  /*
    발송기한 = 공구 마감 + N영업일(주말·공휴일 제외) — 결정 3·15. 결제 화면(C9)의 발송 예정일
    고지와 같은 표현을 쓴다.

    교환·반품은 **직접 발송**이다 — 배송 API가 추적 전용이라 수거 예약을 할 수 없다(서버 클레임
    설계서 0-3). 시안의 「문 앞 회수」는 이 결정 전 문구라 따르지 않는다.

    금액 두 줄은 서버가 기본 배송비로 계산해 내린다 — 반품은 단순 변심일 때 차감되는 최초
    배송비, 교환은 재발송비(편도)다. 고객이 택배사에 내는 반송 택배비는 별도다(같은 설계서 1-8).
  */
  const policies = [
    { key: "배송", value: shippingLine },
    {
      key: "발송 예정",
      value: `공구 마감 후 ${delivery.shippingLeadDays}영업일 이내 발송 (주말·공휴일 제외)`,
    },
    { key: "교환 · 반품", value: "배송완료 후 7일 이내 주문 내역에서 신청 · 택배사에 직접 발송" },
    {
      key: "반품 · 교환 배송비",
      value:
        `단순 변심 반품은 최초 배송비 ${formatPrice(delivery.returnFee)}원 차감 · ` +
        `단순 변심 교환은 재발송비 ${formatPrice(delivery.exchangeFee)}원 · 불량·오배송은 무료 · ` +
        "반송 택배비는 별도(단순 변심은 선불, 불량·오배송은 착불)",
    },
  ];

  return (
    <View style={{ gap: 14 }}>
      {policies.map(policy => (
        <View key={policy.key}>
          <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 17.5 }} className="text-ink">
            {policy.key}
          </Typography>
          <Typography style={{ fontSize: 12.5, lineHeight: 21.25, marginTop: 5 }} className="text-ink76">
            {policy.value}
          </Typography>
        </View>
      ))}

      <View className="rounded-base bg-white p-12">
        <Typography style={{ fontSize: 11.5, lineHeight: 19.55 }} className="text-gray45">
          화장품은 개봉·사용 후 청약철회가 제한될 수 있습니다. 자세한 조건은 판매자에게 문의해 주세요.
        </Typography>
      </View>
    </View>
  );
}
