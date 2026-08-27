import { RouteProp, useRoute } from "@react-navigation/native";

import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import TermsDocumentView from "@/features/terms/views/TermsDocumentView";

/**
 * 공용 스택에서 여는 약관 — C4 쇼룸 하단 고지의 [이용약관] · [개인정보 처리방침].
 *
 * 마이 탭의 같은 화면과 파일을 공유하되, 어느 문서인지를 **화면이 아니라 파라미터로** 받는다.
 * 쇼룸은 SNS 링크로 외부에서 바로 착지하므로 마이 탭을 거쳐 열면 뒤로 갔을 때 쇼룸이 아니라
 * 마이 탭에 남는다.
 */
export default function CommonTermsDocumentView() {
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.TERMS_DOCUMENT>>();

  return <TermsDocumentView termsType={params.termsType} />;
}
