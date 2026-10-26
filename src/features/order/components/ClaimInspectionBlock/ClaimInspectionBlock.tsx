import { ReactNode } from "react";
import { Image, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";
import { ClaimInspection } from "@/features/order/types/claim";
import { formatDueDate, won } from "@/features/order/utils/orderFormat";

/**
 * C10-5 검수 판정 블록(1021 기-17 · 18 · 93 【잠정】) — 상품 아래, 「상품 다시 받기」 자리에 온다.
 *
 * - 반품 사유 번복(1b): 분홍 안내 + 브랜드 설명 · 증빙 사진. 착불로 보냈으면 브랜드가 낸 착불 운임과 최초 배송비를
 *   환불액에서 뺀다 — 금액 줄은 환불 정보가 그린다.
 * - 반품 귀책 변경(1b): 회색 확인 박스. 선불 운임과 차감했던 최초 배송비를 환불에 더한다.
 * - 교환 사유 번복(1c): 분홍 안내 + 브랜드 설명 + 금액 3줄 + 결제 기한. 결제 수단 · 버튼은 반려 재발송비와 같은
 *   것을 화면이 아래에 붙인다(결제 API도 같다).
 *
 * 문구는 시안 그대로이고 금액만 서버 값이다. 브랜드가 쓴 문장은 출처(「○○의 설명」)를 밝혀 본문과 분리한다.
 */
interface ClaimInspectionBlockProps {
  inspection: ClaimInspection;
  brandName: string;
  /** 환불액에서 뺀 최초 배송비(환불 정보의 `returnDeduction`) — 사유 번복 문장에 금액을 적는다 */
  initialFee?: number;
}

function Strong(props: { children: string }) {
  return (
    <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 21.45 }} className="text-ink76">
      {props.children}
    </Typography>
  );
}

/** 분홍 안내 — 본문은 호출부가 `Typography`(13 · #3C3C3C · 위 9)로 넘긴다 */
function NoticeBox(props: { title: string; children: ReactNode }) {
  return (
    <View className="mx-14 rounded-base bg-roseTint p-14" style={{ marginTop: 16 }}>
      <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-roseText">
        {props.title}
      </Typography>
      {props.children}
    </View>
  );
}

function ExplanationBox(props: {
  brandName: string;
  explanation: string | null;
  attachments: Array<string>;
}) {
  const { brandName, explanation, attachments } = props;

  if (!explanation && attachments.length === 0) {
    return null;
  }
  return (
    <View className="mx-14 rounded-base bg-band p-14" style={{ marginTop: 12 }}>
      <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }} className="text-ink76">
        {brandName}의 설명
      </Typography>
      {!!explanation && (
        <Typography style={{ fontSize: 13, lineHeight: 21.45, marginTop: 8 }} className="text-ink76">
          {explanation}
        </Typography>
      )}
      {attachments.length > 0 && (
        <>
          <View className="flex-row flex-wrap" style={{ marginTop: 12, gap: 8 }}>
            {attachments.map(url => (
              <Image key={url} source={{ uri: url }} style={{ width: 72, height: 72, borderRadius: 4 }} />
            ))}
          </View>
          <Typography style={{ fontSize: 11.5, lineHeight: 17.25, marginTop: 8 }} className="text-gray45">
            브랜드가 입고 검수 때 촬영한 사진이에요
          </Typography>
        </>
      )}
    </View>
  );
}

/** 금액 한 줄 — 「재발송 배송비 3,000원」 */
export function FeeLine(props: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between px-14 pt-10" style={{ gap: 12 }}>
      <Typography style={{ fontSize: 13.5, lineHeight: 18.9 }} className="text-ink76">
        {props.label}
      </Typography>
      <Typography style={{ fontSize: 13.5, lineHeight: 18.9 }} className="min-w-0 flex-1 text-right text-ink">
        {props.value}
      </Typography>
    </View>
  );
}

/** 결제 금액 합계 줄 — 위 금액 줄들과 0.5px 선으로 가른다 */
export function FeeTotalLine(props: { value: string }) {
  return (
    <View
      className="mx-14 flex-row justify-between border-t-[0.5px] border-dividerProduct"
      style={{ marginTop: 12, paddingTop: 12, gap: 12 }}
    >
      <Typography style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 18.9 }} className="text-ink">
        결제 금액
      </Typography>
      <Typography
        style={{ fontSize: 15, fontWeight: "700", lineHeight: 21 }}
        className="min-w-0 flex-1 text-right text-ink"
      >
        {props.value}
      </Typography>
    </View>
  );
}

export default function ClaimInspectionBlock(props: ClaimInspectionBlockProps) {
  const { inspection, brandName, initialFee = 0 } = props;
  const initialFeeText = initialFee > 0 ? `최초 배송비 ${won(initialFee)}` : "최초 배송비";
  const { freight, payment } = inspection;

  if (inspection.state === "FAULT_CHANGED") {
    return (
      <View
        className="mx-14 flex-row items-start rounded-base bg-band p-14"
        style={{ marginTop: 16, gap: 10 }}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={{ marginTop: 1 }}>
          <Path
            d="M4.5 12.5l5 5 10-11"
            stroke="#3C3C3C"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <View className="min-w-0 flex-1">
          <Typography style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 20.25 }} className="text-ink">
            검수 결과 상품 불량으로 확인되었어요
          </Typography>
          <Typography style={{ fontSize: 12.5, lineHeight: 20, marginTop: 4 }} className="text-ink76">
            단순 변심으로 신청하셨지만 브랜드 귀책으로 바뀌어, 보내실 때 낸{" "}
            <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 20 }} className="text-ink76">
              {`선불 운임(기본 배송비) ${won(freight.prepaidFreightRefund)}`}
            </Typography>
            과 차감했던{" "}
            <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 20 }} className="text-ink76">
              {`최초 배송비 ${won(freight.initialFeeRestored)}`}
            </Typography>
            을 환불에 더해 돌려드려요.
          </Typography>
        </View>
      </View>
    );
  }

  if (inspection.state === "OVERTURN_PAYMENT_PENDING" && payment) {
    const isPending = payment.status === "PENDING";
    const hasCollect = payment.collectFreight > 0;

    return (
      <View>
        {isPending ? (
          <NoticeBox title="교환 사유가 변경되었어요">
            <Typography style={{ fontSize: 13, lineHeight: 21.45, marginTop: 9 }} className="text-ink76">
              브랜드 검수 결과 단순 변심으로 확인돼{" "}
              <Strong>
                {hasCollect
                  ? `재발송 배송비와 착불 운임 ${won(payment.total)}`
                  : `재발송 배송비 ${won(payment.total)}`}
              </Strong>
              을 결제해야 새 상품이 발송됩니다.
              {hasCollect
                ? " 불량 · 오배송으로 신청해 착불로 보내셨기 때문에 브랜드가 낸 회수 운임을 함께 부담해요."
                : ""}
            </Typography>
          </NoticeBox>
        ) : (
          <NoticeBox title="교환 사유가 변경되었어요">
            <Typography style={{ fontSize: 13, lineHeight: 21.45, marginTop: 9 }} className="text-ink76">
              {`결제하신 ${won(payment.total)}으로 새 상품을 보내드려요.`}
            </Typography>
          </NoticeBox>
        )}
        <ExplanationBox
          brandName={brandName}
          explanation={inspection.explanation}
          attachments={inspection.attachments}
        />
        {isPending && (
          <>
            <FeeLine label="재발송 배송비" value={won(payment.reshipFee)} />
            {hasCollect && (
              <FeeLine label="착불 운임 (브랜드가 낸 회수 운임)" value={won(payment.collectFreight)} />
            )}
            <FeeTotalLine value={won(payment.total)} />
            {!!payment.dueDate && (
              <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="mx-14 mt-12 text-ink76">
                <Typography
                  style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 20 }}
                  className="text-ink76"
                >
                  {`${formatDueDate(payment.dueDate)}까지`}
                </Typography>{" "}
                {payment.overdue
                  ? "결제 기한이 지났어요. 결제하지 않으면 받으신 상품을 그대로 돌려보내드려요."
                  : "결제하지 않으면 받으신 상품을 그대로 돌려보내드려요."}
              </Typography>
            )}
          </>
        )}
      </View>
    );
  }

  // 반품 사유 번복 — 착불 운임이 없으면(선불로 보냈으면) 최초 배송비만 말한다
  return (
    <View>
      <NoticeBox title="반품 사유가 변경되었어요">
        <Typography style={{ fontSize: 13, lineHeight: 21.45, marginTop: 9 }} className="text-ink76">
          {freight.collectFreight > 0
            ? "브랜드 검수 결과 단순 변심으로 확인되었어요. 불량 · 오배송으로 신청해 착불로 보내셨기 때문에, 브랜드가 낸 "
            : `브랜드 검수 결과 단순 변심으로 확인되었어요. ${initialFeeText}을 환불액에서 빼고 돌려드려요.`}
          {freight.collectFreight > 0 && <Strong>{`착불 운임 ${won(freight.collectFreight)}`}</Strong>}
          {freight.collectFreight > 0 ? `과 ${initialFeeText}을 환불액에서 빼고 돌려드려요.` : ""}
        </Typography>
      </NoticeBox>
      <ExplanationBox
        brandName={brandName}
        explanation={inspection.explanation}
        attachments={inspection.attachments}
      />
    </View>
  );
}
