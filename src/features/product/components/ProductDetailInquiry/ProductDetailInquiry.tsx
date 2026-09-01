import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { ChevronRightIcon, SpeechBubbleIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import Typography from "@/common/components/Typography/Typography";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import ProductInquiryItem from "@/features/product/components/ProductInquiryItem/ProductInquiryItem";
import { useGetPublicProductInquiries } from "@/features/product/hooks/useGetPublicProductInquiries";

/**
 * C7 상품 상세의 문의 탭.
 *
 * 머리는 **"상품 문의 12"를 한 덩어리**로 묶고(개수만 회색) 우측 [문의하기]는 외곽선 버튼이
 * 아니라 회색 텍스트 + 셰브런이다 — 목록의 머리에서 버튼이 제목과 무게를 다투면 어느 쪽이
 * 이 섹션의 주인인지 흐려진다.
 *
 * 이 탭은 **최근 3건 미리보기**만 두고 나머지는 [문의 전체 보기]로 C7-2에 넘긴다. 상세 안에서
 * 목록을 계속 늘리면 스크롤이 끝없이 길어지고 필터를 붙일 자리도 없다. 그래서 머리의 건수는
 * 잘라 낸 3건이 아니라 **전체 건수**다.
 *
 * ⚠️ 목록 데이터는 아직 서버가 주지 않는다 — `productInquiryService.getPublicList` 주석 참고.
 */
interface ProductDetailInquiryProps {
  productId: number;
  /** 답변 블록에 적을 이름 — 상품 문의는 운영팀이 아니라 판매자가 답한다 */
  sellerName: string;
}

/** 상세 안에서는 최근 3건까지만 — 나머지는 C7-2가 맡는다 */
const PREVIEW_COUNT = 3;

export default function ProductDetailInquiry(props: ProductDetailInquiryProps) {
  const { productId, sellerName } = props;
  const navigation = useCommonNavigation();
  const { data } = useGetPublicProductInquiries(productId);

  /** 한 번에 여러 건을 펼칠 수 있다 — 답변을 나란히 놓고 비교하는 읽기가 실제로 일어난다 */
  const [expandedIds, setExpandedIds] = useState<Array<number>>([]);

  const handleToggle = useCallback((inquiryId: number) => {
    setExpandedIds(previous =>
      previous.includes(inquiryId) ? previous.filter(id => id !== inquiryId) : [...previous, inquiryId]
    );
  }, []);

  const handlePressWrite = usePermissionPress(() => {
    navigation.navigate(COMMON_ROUTES.PRODUCT_INQUIRY, { productId });
  });

  const handlePressHeaderWrite = useCallback(() => handlePressWrite(), [handlePressWrite]);

  const handlePressSeeAll = useCallback(() => {
    navigation.navigate(COMMON_ROUTES.PRODUCT_INQUIRY_LIST, { productId, sellerName });
  }, [navigation, productId, sellerName]);

  const totalCount = data?.totalCount ?? 0;
  const previewItems = (data?.items ?? []).slice(0, PREVIEW_COUNT);

  return (
    <View>
      <View className="flex-row items-center px-14 py-18" style={{ gap: 12 }}>
        <Typography
          style={{ fontSize: 15, fontWeight: "700", lineHeight: 15, letterSpacing: -0.2 }}
          className="min-w-0 flex-1 text-ink"
        >
          {"상품 문의"}
          {/* 건수는 제목과 한 덩어리로 읽히되 색으로만 위계를 낮춘다 — 0이면 적지 않는다 */}
          {totalCount > 0 && <Typography className="text-gray45">{` ${totalCount}`}</Typography>}
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

      {previewItems.length === 0 ? (
        <EmptyState
          icon={<SpeechBubbleIcon size={50} color="#D8D8DA" />}
          title="아직 등록된 문의가 없어요"
          description={"궁금한 점을 남기시면\n판매자가 확인하고 답변해 드려요"}
          paddingTop={40}
          actionLabel="상품 문의하기"
          onPressAction={handlePressWrite}
        />
      ) : (
        <>
          {previewItems.map(inquiry => (
            <ProductInquiryItem
              key={inquiry.id}
              inquiry={inquiry}
              sellerName={sellerName}
              isExpanded={expandedIds.includes(inquiry.id)}
              onToggle={handleToggle}
            />
          ))}

          <View className="px-14" style={{ paddingTop: 16, paddingBottom: 26 }}>
            <TouchableOpacity
              onPress={handlePressSeeAll}
              activeOpacity={0.75}
              className="h-44 flex-row items-center justify-center rounded-base border border-gray3"
              style={{ gap: 5 }}
            >
              <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
                문의 전체 보기
              </Typography>
              <ChevronRightIcon size={13} color="#C7C7C7" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
