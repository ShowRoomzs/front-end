import { IdentityVerification } from "@portone/react-native-sdk";
import { ComponentProps, useRef } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CloseIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { IdentityVerificationWindow } from "@/features/auth/services/identityVerificationService";

/**
 * 포트원 본인인증창(PASS · 통신사) — 결제창(`PortOnePaymentModal`)과 같은 전체 화면 모달.
 *
 * 인증창은 통신사가 그리는 화면이라 앱이 디자인하지 않는다. 결과 판정은 여기서 하지 않는다 — `code`가 있으면
 * 사용자가 그만뒀거나 실패한 것이고, 없으면 서버 확인으로 넘긴다. 한 번 끝난 인증의 뒤늦은 콜백은 버린다.
 */
interface PortOneIdentityModalProps {
  /** null이면 닫힌 상태 */
  request: IdentityVerificationWindow | null;
  /** 인증창이 끝남 — `failed`면 사용자가 닫았거나 통신사 인증이 실패했다 */
  onFinish: (identityVerificationId: string, failed: boolean) => void;
}

type PortOneIdentityRequest = ComponentProps<typeof IdentityVerification>["request"];

export default function PortOneIdentityModal(props: PortOneIdentityModalProps) {
  const { request, onFinish } = props;
  const settledId = useRef<string | null>(null);

  if (!request) {
    return null;
  }
  const finish = (failed: boolean) => {
    if (settledId.current === request.identityVerificationId) {
      return;
    }
    settledId.current = request.identityVerificationId;
    onFinish(request.identityVerificationId, failed);
  };

  return (
    <Modal visible animationType="slide" onRequestClose={() => finish(true)}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="h-46 flex-row items-center justify-between px-14">
          <Typography style={{ fontSize: 16, fontWeight: "600", lineHeight: 16 }} className="text-ink">
            본인인증
          </Typography>
          <TouchableOpacity
            onPress={() => finish(true)}
            activeOpacity={0.6}
            style={{ padding: 10, margin: -10 }}
          >
            <CloseIcon size={18} color="#0F0F0F" />
          </TouchableOpacity>
        </View>
        <IdentityVerification
          request={request as unknown as PortOneIdentityRequest}
          onComplete={response => finish(!!(response as { code?: string }).code)}
          onError={() => finish(true)}
        />
      </SafeAreaView>
    </Modal>
  );
}
