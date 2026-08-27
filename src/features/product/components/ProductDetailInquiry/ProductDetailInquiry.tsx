import { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

import { ChevronRightIcon, SpeechBubbleIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import Typography from "@/common/components/Typography/Typography";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";

/**
 * C7 상품 상세의 문의 탭.
 *
 * **목록은 아직 그리지 못한다.** 서버에 상품별 공개 문의를 내려주는 API가 없다 —
 * `/v1/user/product-inquiries`는 로그인한 사람의 **자기 문의**만 주고, 응답에 작성자 이름도
 * 없어 디자인의 `수민** · 2026.08.08` 표기를 만들 수 없다. 남의 문의가 안 보이는 목록에
 * "상품 문의 12" 같은 건수를 붙이면 그 숫자가 거짓이 된다.
 *
 * 그래서 **건수를 적지 않고** 목록 자리는 준비 중으로 둔다. 대신 [문의하기]는 살려 둔다 —
 * 작성(C7-1)은 서버가 완전히 지원하므로 지금도 묻고 답을 받을 수 있다.
 *
 * 서버에 `GET /products/{id}/inquiries`(+ 마스킹된 작성자명)가 생기면 이 컴포넌트만 갈아 끼우면
 * 되고, 머리의 [문의하기] 줄은 그대로 쓴다.
 */
interface ProductDetailInquiryProps {
  productId: number;
}

export default function ProductDetailInquiry(props: ProductDetailInquiryProps) {
  const { productId } = props;
  const navigation = useCommonNavigation();

  const handlePressWrite = usePermissionPress(() => {
    navigation.navigate(COMMON_ROUTES.PRODUCT_INQUIRY, { productId });
  });

  const handlePressHeaderWrite = useCallback(() => handlePressWrite(), [handlePressWrite]);

  return (
    <View>
      {/*
        머리의 [문의하기]는 외곽선 버튼이 아니라 회색 텍스트 + 셰브런이다 — 목록의 머리에서
        버튼이 제목과 무게를 다투면 어느 쪽이 이 섹션의 주인인지 흐려진다.
      */}
      <View className="flex-row items-center px-14 py-18" style={{ gap: 12 }}>
        <Typography
          style={{ fontSize: 15, fontWeight: "700", lineHeight: 15, letterSpacing: -0.2 }}
          className="min-w-0 flex-1 text-ink"
        >
          상품 문의
        </Typography>

        <TouchableOpacity
          onPress={handlePressHeaderWrite}
          activeOpacity={0.5}
          className="flex-row items-center"
          style={{ gap: 3, paddingVertical: 10, paddingHorizontal: 4, margin: -10 }}
        >
          <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 }} className="text-gray45">
            문의하기
          </Typography>
          <ChevronRightIcon size={13} color="#C7C7C7" />
        </TouchableOpacity>
      </View>

      <EmptyState
        icon={<SpeechBubbleIcon size={50} color="#D8D8DA" />}
        title="문의 목록을 준비하고 있어요"
        description={"지금도 문의를 남기실 수 있고,\n답변이 등록되면 알림으로 알려드려요"}
        paddingTop={40}
        actionLabel="상품 문의하기"
        onPressAction={handlePressWrite}
      />

      <View className="h-40" />
    </View>
  );
}
