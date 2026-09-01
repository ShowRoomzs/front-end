import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SpeechBubbleIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import FilterChips, { FilterChipItem } from "@/common/components/FilterChips/FilterChips";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import ProductInquiryItem from "@/features/product/components/ProductInquiryItem/ProductInquiryItem";
import { useGetPublicProductInquiries } from "@/features/product/hooks/useGetPublicProductInquiries";

/**
 * C7-2 문의 전체 — 상품 상세의 문의 탭이 미리보기 3건에서 넘겨주는 화면.
 *
 * 상세 안에서 목록을 계속 늘리면 스크롤이 끝없이 길어지고 필터를 붙일 자리도 없다. 그래서
 * 전체 목록과 **유형 필터**는 이쪽이 맡는다.
 *
 * 항목은 상세와 **같은 컴포넌트**를 쓴다 — 같은 글이 두 화면에서 다르게 읽히면 어느 쪽이
 * 맞는 표기인지 알 수 없다. 질의도 같은 키를 공유해 넘어오는 순간 다시 부르지 않는다.
 *
 * 필터는 **서버가 아니라 화면이** 건다. 공개 목록 API가 아직 없어 유형 파라미터도 정해지지
 * 않았고, 유형은 5종뿐이라 받아 둔 목록에서 거르면 된다. 서버가 유형 필터를 지원하면
 * `selectedType`을 질의 파라미터로 올리면 된다.
 */
const ALL = "ALL";

/** 하단 고정 CTA — 위 여백 12 + 버튼 52 + 아래 여백 26 */
const BOTTOM_CTA_HEIGHT = 90;

export default function ProductInquiryListView() {
  const { params } = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.PRODUCT_INQUIRY_LIST>>();
  const { productId, sellerName } = params;
  const { bottom } = useSafeAreaInsets();
  const navigation = useCommonNavigation();

  const { data, isLoading } = useGetPublicProductInquiries(productId);
  const [selectedType, setSelectedType] = useState<string>(ALL);
  const [expandedIds, setExpandedIds] = useState<Array<number>>([]);

  const items = useMemo(() => data?.items ?? [], [data]);

  /**
   * 칩은 **실제로 문의가 있는 유형만** 세운다.
   *
   * 5종을 다 세우면 눌러도 빈 목록만 나오는 칩이 섞이고, 그 자리에서 사용자는 자기가 필터를
   * 잘못 골랐는지 원래 문의가 없는지 구분할 수 없다. 순서는 서버가 준 목록 순서를 따른다.
   */
  const chips = useMemo((): Array<FilterChipItem<string>> => {
    const typeNames = [...new Set(items.map(item => item.typeName))];

    return [{ value: ALL, label: "전체" }, ...typeNames.map(name => ({ value: name, label: name }))];
  }, [items]);

  const visibleItems = useMemo(
    () => (selectedType === ALL ? items : items.filter(item => item.typeName === selectedType)),
    [items, selectedType]
  );

  const handleToggle = useCallback((inquiryId: number) => {
    setExpandedIds(previous =>
      previous.includes(inquiryId) ? previous.filter(id => id !== inquiryId) : [...previous, inquiryId]
    );
  }, []);

  const handlePressWrite = usePermissionPress(() => {
    navigation.navigate(COMMON_ROUTES.PRODUCT_INQUIRY, { productId });
  });

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="상품 문의" onPressBack={navigation.goBack} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: bottom + BOTTOM_CTA_HEIGHT }}
        >
          <View className="pb-14 pt-12">
            <FilterChips items={chips} selectedValue={selectedType} onSelect={setSelectedType} />
          </View>

          {visibleItems.length === 0 ? (
            <EmptyState
              fill
              icon={<SpeechBubbleIcon size={50} color="#D8D8DA" />}
              title={selectedType === ALL ? "아직 등록된 문의가 없어요" : "이 유형의 문의가 아직 없어요"}
              description={
                selectedType === ALL
                  ? "궁금한 점을 남기시면\n판매자가 확인하고 답변해 드려요"
                  : "다른 유형을 보시거나\n직접 문의를 남겨 보세요"
              }
            />
          ) : (
            visibleItems.map(inquiry => (
              <ProductInquiryItem
                key={inquiry.id}
                inquiry={inquiry}
                sellerName={sellerName}
                isExpanded={expandedIds.includes(inquiry.id)}
                onToggle={handleToggle}
              />
            ))
          )}
        </ScrollView>
      )}

      <View
        className="absolute bottom-0 left-0 right-0 border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={handlePressWrite}
          activeOpacity={0.8}
          className="h-52 flex-row items-center justify-center rounded-base bg-rose"
        >
          <Typography variant="buttonPrimary" className="text-white">
            문의하기
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
