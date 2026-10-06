import { ScrollView, View } from "react-native";

import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import {
  AmountRow,
  Band,
  CloseHeader,
  InfoRow,
  OutlineAction,
  ProductBlock,
  SectionTitle,
} from "@/features/order/components/OrderParts/OrderParts";
import { useGetClaimDetail } from "@/features/order/hooks/useOrderQueries";
import { ClaimDetailResponse } from "@/features/order/types/claim";
import { won } from "@/features/order/utils/orderFormat";

/**
 * 반품·교환 접수 화면 — 요청 → 확인 모달 → **접수**(시안 C10-3).
 *
 * 제목은 「완료」가 아니라 「접수」다 — 검수 전이라 환불이 확정되지 않았다. 나중에 입력을 골랐으면
 * 「7일 안에 송장을 등록하지 않으면 요청이 자동 취소돼요」를 굵게 덧붙인다.
 * 서버는 접수 화면과 상세가 같은 데이터라고 정했다 — 상세 응답으로 그린다.
 */
interface ClaimReceiptProps {
  claimId: number;
  invoiceDueDays: number;
  onClose: () => void;
  onPressDetail: () => void;
  onPressOrderList: () => void;
}

export default function ClaimReceipt(props: ClaimReceiptProps) {
  const { claimId, invoiceDueDays, onClose, onPressDetail, onPressOrderList } = props;
  const { data: detail } = useGetClaimDetail(claimId);
  const kw = detail?.type === "EXCHANGE" ? "교환" : "반품";

  return (
    <View className="absolute bottom-0 left-0 right-0 top-0 bg-white" style={{ zIndex: 21 }}>
      <CloseHeader title={`${kw} 요청`} onClose={onClose} />
      {!detail ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <ReceiptBody
          detail={detail}
          kw={kw}
          invoiceDueDays={invoiceDueDays}
          onPressDetail={onPressDetail}
          onPressOrderList={onPressOrderList}
        />
      )}
    </View>
  );
}

function ReceiptBody(props: {
  detail: ClaimDetailResponse;
  kw: string;
  invoiceDueDays: number;
  onPressDetail: () => void;
  onPressOrderList: () => void;
}) {
  const { detail, kw, invoiceDueDays, onPressDetail, onPressOrderList } = props;
  const isReturn = detail.type === "RETURN";
  const isLater = !detail.info.collectionInvoice;
  const { returnTo, reshipTo } = detail.info;
  const courierLine =
    detail.guide.courierPayment === "COLLECT"
      ? "착불로 보내주세요 · 택배비는 브랜드가 부담해요"
      : "선불로 보내주세요 · 반송 택배비는 택배사에 직접 결제해요";

  const notes: Array<{ text: string; strong?: boolean }> = [];

  if (isLater) {
    notes.push({ text: `마이 > 주문 내역의 ${kw} 상세에서 송장 번호를 등록할 수 있어요.` });
    notes.push({
      text: `${invoiceDueDays}일 안에 송장을 등록하지 않으면 요청이 자동 취소돼요.`,
      strong: true,
    });
  } else {
    notes.push({ text: "송장 정보가 업데이트되면 회수 상황을 확인할 수 있어요." });
  }
  notes.push({
    text: isReturn
      ? "브랜드가 검수를 마치면 환불되고, 알림으로 알려드려요."
      : "브랜드가 검수를 마치면 새 상품을 보내드리고, 알림으로 알려드려요.",
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="px-14 pt-24">
        <Typography
          style={{ fontSize: 19, fontWeight: "700", lineHeight: 27.55, letterSpacing: -0.4 }}
          className="text-ink"
        >
          {kw} 요청이 접수되었어요
        </Typography>
        <View className="items-center rounded-base bg-band px-14 py-13" style={{ marginTop: 14 }}>
          <Typography style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 18.9 }} className="text-ink">
            {kw} 방법 : 직접 발송 ({isLater ? "나중에 입력" : "송장 입력 완료"})
          </Typography>
        </View>
        <View style={{ marginTop: 12, gap: 5 }}>
          {notes.map(note => (
            <View key={note.text} className="flex-row" style={{ gap: 7 }}>
              <Typography
                style={{ fontSize: 12, lineHeight: 19.8 }}
                className={note.strong ? "text-ink76" : "text-gray45"}
              >
                •
              </Typography>
              <Typography
                style={{ fontSize: 12, fontWeight: note.strong ? "600" : "400", lineHeight: 19.8 }}
                className={`min-w-0 flex-1 ${note.strong ? "text-ink76" : "text-gray45"}`}
              >
                {note.text}
              </Typography>
            </View>
          ))}
        </View>
      </View>

      <Band marginTop={20} />
      <SectionTitle title={`${kw} 신청 정보`} />
      <View className="px-14 pt-8">
        <InfoRow label="보낼 곳" labelWidth={62} fontSize={13}>
          <Typography style={{ fontSize: 13, lineHeight: 20.8 }} className="text-ink">
            {returnTo.name} ·{" "}
            <Typography style={{ fontSize: 13, lineHeight: 20.8, textDecorationLine: "underline" }}>
              {returnTo.contact}
            </Typography>
          </Typography>
          <Typography style={{ fontSize: 13, lineHeight: 20.8 }} className="text-ink76">
            {`${returnTo.address}${returnTo.detailAddress ? ` ${returnTo.detailAddress}` : ""}`}
          </Typography>
        </InfoRow>
        <InfoRow label="사유" labelWidth={62} fontSize={13} value={detail.info.reasonLabel} />
        <InfoRow label="택배비" labelWidth={62} fontSize={13} value={courierLine} />
        {!isReturn && !!reshipTo && (
          <InfoRow
            label="받을 곳"
            labelWidth={62}
            fontSize={13}
            value={`${reshipTo.recipientName} / ${reshipTo.phoneNumber}\n${reshipTo.address}${
              reshipTo.detailAddress ? ` ${reshipTo.detailAddress}` : ""
            }`}
          />
        )}
      </View>

      <Band marginTop={18} />
      <SectionTitle title={isReturn ? "환불 정보" : "결제 정보"} />
      {isReturn && !!detail.refund && (
        <>
          <View className="px-14" style={{ paddingTop: 14, gap: 9 }}>
            <AmountRow label="결제 금액" value={won(detail.refund.approvedAmount)} />
            <AmountRow
              label="배송비 차감"
              value={detail.refund.returnDeduction > 0 ? `-${won(detail.refund.returnDeduction)}` : "0원"}
              valueColor={detail.refund.returnDeduction > 0 ? "#CF3D61" : "#0F0F0F"}
            />
          </View>
          <MoneyTotal label="환불 예정 금액" value={won(detail.refund.amount)} />
          {!!detail.refund.refundMethodLabel && (
            <View className="px-14 pt-10">
              <AmountRow label="환불 수단" value={detail.refund.refundMethodLabel} />
            </View>
          )}
        </>
      )}
      {!isReturn && !!detail.exchangePayment && (
        <>
          <View className="px-14" style={{ paddingTop: 14, gap: 9 }}>
            <AmountRow
              label="교환 상품 금액"
              value={won(detail.items.reduce((sum, item) => sum + item.amount, 0))}
            />
            <AmountRow label="재발송 배송비" value={won(detail.exchangePayment.reshipFee)} />
          </View>
          <MoneyTotal label="결제 금액" value={won(detail.exchangePayment.paidAmount)} />
          <View className="px-14 pt-10">
            <AmountRow label="결제 수단" value={detail.exchangePayment.methodLabel} />
          </View>
        </>
      )}

      <Band marginTop={18} />
      <SectionTitle title={`${kw} 상품`} count={`${detail.items.length}개`} style={{ paddingBottom: 4 }} />
      {detail.items.map(item => (
        <View key={item.claimId} className="px-14 pt-12">
          <ProductBlock
            thumbnailUrl={item.thumbnailUrl}
            brand={item.brandName}
            name={item.productName}
            meta={`${item.optionName} · ${item.quantity}개`}
            newMeta={
              !isReturn && item.exchangeOptionName ? `${item.exchangeOptionName} · ${item.quantity}개` : null
            }
            price={won(item.amount)}
          />
        </View>
      ))}

      <View className="flex-row px-14" style={{ paddingTop: 18, paddingBottom: 26, gap: 8 }}>
        <OutlineAction label={`${kw} 상세`} height={44} fontSize={13.5} onPress={onPressDetail} />
        <OutlineAction label="주문 내역으로" height={44} fontSize={13.5} onPress={onPressOrderList} />
      </View>
    </ScrollView>
  );
}

function MoneyTotal(props: { label: string; value: string }) {
  return (
    <View
      className="mx-14 flex-row items-baseline justify-between border-t-[0.5px] border-dividerProduct"
      style={{ marginTop: 12, paddingTop: 13, gap: 12 }}
    >
      <Typography style={{ fontSize: 14.5, fontWeight: "700", lineHeight: 14.5 }} className="text-ink">
        {props.label}
      </Typography>
      <Typography
        style={{ fontSize: 17, fontWeight: "700", lineHeight: 17, letterSpacing: -0.4 }}
        className="text-ink"
      >
        {props.value}
      </Typography>
    </View>
  );
}
