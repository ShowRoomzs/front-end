import { Payment } from "@portone/react-native-sdk";
import { ComponentProps, useCallback, useRef } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CloseIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { PaymentWindow, PortOneClientResult } from "@/features/order/types/payment";

/**
 * 포트원 결제창 — 주문 결제(C9)와 반품·교환 배송비 결제(C10-3 · C10-5)가 같이 쓴다.
 *
 * 결제창은 결제사가 그리는 화면이라 앱이 디자인하지 않는다(시안 C10-3 「EXTERNAL · PG」).
 * 앱은 전체 화면 모달로 띄우고 닫기만 둔다.
 *
 * **결과 판정은 여기서 하지 않는다.** `onComplete`의 `code` 유무는 힌트일 뿐이고, 부르는 쪽이
 * 결과와 관계없이 서버의 확정 API를 부른다. 사용자가 X로 닫아 콜백이 오지 않은 경우도
 * `onClose`로 알려 같은 확정 API로 상태를 확인하게 한다(READY면 결제되지 않은 것).
 *
 * 같은 paymentId로 결제창을 **동시에 둘** 띄우지 않는다 — 한 번 끝나면 그 뒤 콜백은 버린다.
 */
interface PortOnePaymentModalProps {
  /** null이면 닫힌 상태 */
  payment: PaymentWindow | null;
  onComplete: (paymentId: string, result: PortOneClientResult) => void;
  /** SDK 자체 오류(결제창이 아예 안 뜸) — 결제는 일어나지 않았다 */
  onError: (paymentId: string, error: Error) => void;
  /** 사용자가 창을 직접 닫음 — 콜백이 오지 않을 수 있어 확정 API로 상태를 확인한다 */
  onClose: (paymentId: string) => void;
}

type PortOneRequest = ComponentProps<typeof Payment>["request"];

/**
 * 서버의 평평한 `payment` 블록 → SDK 요청.
 *
 * 카드사·간편결제 두 필드만 중첩 객체로 옮긴다. `customer.email`이 null이면 키를 빼고 보낸다
 * (개인정보 제3자 제공 동의 범위에 따라 서버가 비운다). `redirectUrl`은 넣지 않는다 — RN SDK가
 * 내부에서 `portone://blank`로 덮어쓰고 그 결과를 `onComplete`로 돌려준다.
 */
export function toPortOneRequest(payment: PaymentWindow): PortOneRequest {
  return {
    storeId: payment.storeId,
    channelKey: payment.channelKey,
    paymentId: payment.paymentId,
    orderName: payment.orderName,
    totalAmount: payment.totalAmount,
    currency: payment.currency,
    payMethod: payment.payMethod,
    ...(payment.payMethod === "CARD" && payment.cardCompany
      ? { card: { cardCompany: payment.cardCompany } }
      : {}),
    ...(payment.payMethod === "EASY_PAY" && payment.easyPayProvider
      ? { easyPay: { easyPayProvider: payment.easyPayProvider } }
      : {}),
    customer: {
      fullName: payment.customer.fullName,
      phoneNumber: payment.customer.phoneNumber,
      ...(payment.customer.email ? { email: payment.customer.email } : {}),
    },
  } as unknown as PortOneRequest;
}

export default function PortOnePaymentModal(props: PortOnePaymentModalProps) {
  const { payment, onComplete, onError, onClose } = props;
  /** 이미 끝난 결제의 뒤늦은 콜백을 버린다 — 확정 API가 두 번 불리지 않게 */
  const settledPaymentId = useRef<string | null>(null);

  const settle = useCallback((paymentId: string) => {
    if (settledPaymentId.current === paymentId) {
      return false;
    }
    settledPaymentId.current = paymentId;
    return true;
  }, []);

  if (!payment) {
    return null;
  }

  const { paymentId } = payment;

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => {
        if (settle(paymentId)) {
          onClose(paymentId);
        }
      }}
    >
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-white">
        <View className="h-46 flex-row items-center justify-between border-b-[0.5px] border-divider pl-16 pr-4">
          <Typography
            style={{ fontSize: 16, fontWeight: "600", lineHeight: 16, letterSpacing: -0.3 }}
            className="text-ink"
          >
            결제
          </Typography>
          <TouchableOpacity
            onPress={() => {
              if (settle(paymentId)) {
                onClose(paymentId);
              }
            }}
            activeOpacity={0.4}
            className="p-11"
          >
            <CloseIcon size={22} color="#0F0F0F" thickness={1.8} />
          </TouchableOpacity>
        </View>

        <Payment
          key={paymentId}
          request={toPortOneRequest(payment)}
          onComplete={response => {
            if (!settle(paymentId)) {
              return;
            }
            const result = response as { code?: string; message?: string; txId?: string };

            onComplete(paymentId, {
              code: result.code ?? null,
              message: result.message ?? null,
              txId: result.txId ?? null,
            });
          }}
          onError={error => {
            if (settle(paymentId)) {
              onError(paymentId, error);
            }
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}
