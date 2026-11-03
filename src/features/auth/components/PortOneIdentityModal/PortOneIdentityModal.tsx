import { IdentityVerification } from "@portone/react-native-sdk";
import { ComponentProps, useRef } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CloseIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import {
  IdentityVerificationSdkResult,
  IdentityVerificationWindow,
} from "@/features/auth/services/identityVerificationService";

/**
 * 포트원 본인인증창(PASS · 통신사) — 결제창(`PortOnePaymentModal`)과 같은 전체 화면 모달.
 *
 * 인증창은 통신사가 그리는 화면이라 앱이 디자인하지 않는다. 결과 판정은 여기서 하지 않는다 — 창이 돌려준 값을
 * 그대로 넘기면 서버가 포트원에 물어 판정한다. 한 번 끝난 창의 뒤늦은 콜백은 버린다 — 서버가 1분 안의 재시도에
 * 같은 id를 돌려주므로 id가 아니라 요청 객체로 가린다.
 */
interface PortOneIdentityModalProps {
  /** null이면 닫힌 상태 */
  request: IdentityVerificationWindow | null;
  /** 인증창이 끝남 — 사용자가 닫았거나 창이 오류로 끝났으면 null */
  onFinish: (result: IdentityVerificationSdkResult | null) => void;
}

type PortOneIdentityRequest = ComponentProps<typeof IdentityVerification>["request"];

export default function PortOneIdentityModal(props: PortOneIdentityModalProps) {
  const { request, onFinish } = props;
  const settled = useRef<IdentityVerificationWindow | null>(null);

  if (!request) {
    return null;
  }
  const finish = (result: IdentityVerificationSdkResult | null) => {
    if (settled.current === request) {
      return;
    }
    settled.current = request;
    onFinish(result);
  };

  return (
    <Modal visible animationType="slide" onRequestClose={() => finish(null)}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="h-46 flex-row items-center justify-between px-14">
          <Typography style={{ fontSize: 16, fontWeight: "600", lineHeight: 16 }} className="text-ink">
            본인인증
          </Typography>
          <TouchableOpacity
            onPress={() => finish(null)}
            activeOpacity={0.55}
            style={{ padding: 10, margin: -10 }}
          >
            <CloseIcon size={18} color="#0F0F0F" />
          </TouchableOpacity>
        </View>
        <IdentityVerification
          request={request as unknown as PortOneIdentityRequest}
          onComplete={response =>
            finish({
              identityVerificationTxId: response.identityVerificationTxId,
              code: response.code,
              pgCode: response.pgCode,
            })
          }
          onError={() => finish(null)}
        />
      </SafeAreaView>
    </Modal>
  );
}
