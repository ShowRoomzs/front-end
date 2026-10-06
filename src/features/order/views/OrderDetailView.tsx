import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";

import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import OrderItemCard from "@/features/order/components/OrderItemCard/OrderItemCard";
import {
  AmountRow,
  Band,
  CopyButton,
  NoticeBox,
  OutlineAction,
  SectionTitle,
  TotalRow,
  UnderlineLink,
} from "@/features/order/components/OrderParts/OrderParts";
import { useOrderNavigation } from "@/features/order/hooks/useOrderNavigation";
import { invalidateOrderQueries, useGetOrderDetail } from "@/features/order/hooks/useOrderQueries";
import { orderService } from "@/features/order/services/orderService";
import { OrderNotice } from "@/features/order/types/order";
import { copyToClipboard } from "@/features/order/utils/copyToClipboard";
import {
  formatMonthDay,
  formatOrderDate,
  resolveErrorMessage,
  won,
} from "@/features/order/utils/orderFormat";

/**
 * C10-1 주문 상세 — 주문번호 → 배송지 → 주문 상품(항목별 상태 + 액션) → 결제 정보.
 *
 * **상태를 주문이 아니라 상품에 붙였다** — 공동구매는 브랜드가 다르면 따로 발송되므로 한 주문
 * 안에서 상품마다 상태가 갈린다. 주문 전체에 큰 상태 헤드라인을 두면 일부만 도착한 주문에서 거짓이 된다.
 *
 * 배송 추적은 이 화면에 없다 — 이력은 송장 단위라 C10-2가 맡고, 여기서는 항목별 [배송 조회]로 넘긴다.
 *
 * 배송지·연락처는 **마스킹된 값**만 그린다(스크린샷으로 공유되는 일이 많다). [배송지 변경]은
 * 결제완료이고 브랜드가 준비를 시작하기 전에만 나오고(`addressChangeable`), 그 뒤는 「주문 시점 정보」다.
 */
export default function OrderDetailView() {
  const navigation = useCommonNavigation();
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.ORDER_DETAIL>>();
  const { orderId } = params;
  const { data: order, isLoading, refetch } = useGetOrderDetail(orderId);
  const { open, handleItemAction, openCancelDetail } = useOrderNavigation();

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const handlePressChangeAddress = useCallback(() => {
    if (!order) {
      return;
    }
    navigation.navigate(COMMON_ROUTES.ADDRESS_SELECT, {
      matchAddress: {
        recipientName: order.deliveryAddress.recipientName,
        zipCode: order.deliveryAddress.zipCode,
        address: order.deliveryAddress.address,
      },
      onSelect: async address => {
        try {
          await orderService.changeDeliveryAddress(order.orderId, address.id);
          toast.show("배송지를 변경했어요");
          invalidateOrderQueries();
          return true;
        } catch (error) {
          // 그사이 브랜드가 준비를 시작했으면 409 — 문구를 띄우고 상세를 다시 읽는다
          toast.show(resolveErrorMessage(error, "배송지를 변경하지 못했어요"));
          invalidateOrderQueries();
          return true;
        }
      },
    });
  }, [navigation, order]);

  if (isLoading || !order) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="주문 상세" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  const { maskedAddress, summary } = order;
  const isAllConfirmed = order.items.length > 0 && order.items.every(item => item.status === "CONFIRMED");
  const addressLines = [
    `${maskedAddress.address}${maskedAddress.detailAddress ? `, ${maskedAddress.detailAddress}` : ""}`,
    maskedAddress.phoneNumber,
  ];

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="주문 상세" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-14 pt-20">
          <Typography
            style={{ fontSize: 19, fontWeight: "700", lineHeight: 24.7, letterSpacing: -0.4 }}
            className="text-ink"
          >
            {formatOrderDate(order.orderedAt)}
          </Typography>
          <View className="flex-row items-center" style={{ marginTop: 7 }}>
            <Typography style={{ fontSize: 12.5, lineHeight: 16.25 }} className="text-gray45">
              주문번호 {order.orderNumber}
            </Typography>
            <CopyButton onPress={() => copyToClipboard(order.orderNumber, "주문번호를 복사했어요")} />
          </View>
        </View>

        {order.notices.map(notice => (
          <OrderNoticeBlock key={notice.type} notice={notice} />
        ))}

        <Band marginTop={20} />

        <SectionTitle
          title="배송지"
          right={
            order.addressChangeable ? (
              <UnderlineLink label="배송지 변경" onPress={handlePressChangeAddress} />
            ) : (
              <Typography style={{ fontSize: 12, lineHeight: 12 }} className="text-gray45">
                주문 시점 정보
              </Typography>
            )
          }
        />
        <View className="px-14 pt-12">
          <Typography style={{ fontSize: 14.5, fontWeight: "600", lineHeight: 20.3 }} className="text-ink">
            {maskedAddress.recipientName}
          </Typography>
          <Typography style={{ fontSize: 13, lineHeight: 22.75, marginTop: 7 }} className="text-ink76">
            {addressLines.join("\n")}
            {!!(maskedAddress.memo || order.deliveryMemo) && (
              <Typography style={{ fontSize: 13, lineHeight: 22.75 }} className="text-gray45">
                {`\n${maskedAddress.memo ?? order.deliveryMemo}`}
              </Typography>
            )}
          </Typography>
        </View>

        <Band marginTop={20} />

        <SectionTitle title="주문 상품" count={order.itemCount} />
        {order.items.map((item, ix) => (
          <OrderItemCard
            key={item.orderProductId}
            item={item}
            variant="detail"
            isFirst={ix === 0}
            onPressAction={action => handleItemAction(order.orderId, item, action)}
            onPressClaim={claimId => open(COMMON_ROUTES.CLAIM_DETAIL, { claimId })}
            onPressCancelRejection={openCancelDetail}
          />
        ))}

        <Band />

        <SectionTitle title="결제 정보" />
        <View className="px-14" style={{ paddingTop: 13, gap: 8 }}>
          <AmountRow label="상품 금액" value={won(summary.productTotal)} />
          {summary.discountTotal > 0 && (
            <AmountRow
              label="공동구매 할인"
              value={`−${won(summary.discountTotal)}`}
              valueColor="#CF3D61"
              valueWeight="600"
            />
          )}
          <AmountRow
            label="배송비"
            value={summary.deliveryFeeTotal > 0 ? won(summary.deliveryFeeTotal) : "무료배송"}
          />
        </View>
        <TotalRow
          label="결제 금액"
          value={won(summary.totalAmount)}
          prefix={
            summary.discountRate ? (
              // 로즈는 할인 수치에만 — 금액은 잉크
              <Typography style={{ fontSize: 14, fontWeight: "700", lineHeight: 14 }} className="text-rose">
                {summary.discountRate}%
              </Typography>
            ) : undefined
          }
        />
        {!!order.payment && (
          <View className="flex-row items-baseline justify-between px-14 pt-12" style={{ gap: 12 }}>
            <Typography style={{ fontSize: 13, lineHeight: 19.5 }} className="text-gray45">
              결제수단
            </Typography>
            <Typography style={{ fontSize: 13, fontWeight: "500", lineHeight: 19.5 }} className="text-ink">
              {order.payment.methodLabel}
            </Typography>
          </View>
        )}

        {/*
          구매확정 뒤 하자는 셀프 반품이 없다 — 1:1 문의로 접수하면 운영자가 반품을 대신 연다(결정 2).
          개입할 것이 없는 종결 상태라 로즈를 쓰지 않는다.
        */}
        {isAllConfirmed && (
          <View className="px-14 pt-20">
            <View className="flex-row">
              <OutlineAction
                label="1:1 문의"
                height={44}
                fontSize={13}
                onPress={() =>
                  open(COMMON_ROUTES.INQUIRY_REGISTER, {
                    orderId: order.orderId,
                    orderNumber: order.orderNumber,
                  })
                }
              />
            </View>
            <Typography
              style={{ fontSize: 12, lineHeight: 19.2, marginTop: 9 }}
              className="text-center text-gray45"
            >
              상품에 하자가 있으면 1:1 문의로 접수해 주세요 — 확인 후 반품을 열어 드려요
            </Typography>
          </View>
        )}

        <View className="h-30" />
      </ScrollView>
    </View>
  );
}

/** 상단 안내 — 조건은 서버가, 문구는 앱이 정한다 */
function OrderNoticeBlock(props: { notice: OrderNotice }) {
  const { notice } = props;

  if (notice.type === "CONFIRM_DUE") {
    // 기한이 있는 유일한 구간이라 로즈 — 날짜를 굵게 적어 지금 확인해야 하는 이유를 만든다
    return (
      <NoticeBox tone="rose" style={{ marginTop: 16 }}>
        <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="text-ink76">
          <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 20 }} className="text-ink76">
            {formatMonthDay(notice.date)}에 구매확정
          </Typography>
          돼요. 확정 뒤에는 반품·교환을 신청할 수 없으니 그전에 확인해 주세요.
        </Typography>
      </NoticeBox>
    );
  }
  return (
    <NoticeBox style={{ marginTop: 16 }}>
      <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="text-ink76">
        브랜드가 발송을 준비하고 있어요. 지금 취소는{" "}
        <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 20 }} className="text-ink76">
          요청으로 접수
        </Typography>
        되고, 그사이 발송되면 거절될 수 있어요.
      </Typography>
    </NoticeBox>
  );
}
