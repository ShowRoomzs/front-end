import { useCallback, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Accordion from "@/common/components/Accordion/Accordion";
import FilterChips, { FilterChipItem } from "@/common/components/FilterChips/FilterChips";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { useGetFaqCategories, useGetFaqList } from "@/features/faq/hooks/useGetFaq";

/**
 * C16 고객센터 — FAQ(운영자 게시 정적 콘텐츠) + 하단 고정 [1:1 문의하기].
 *
 * 전체 칩은 분류 값이 아니라 "필터 없음"을 뜻하는 의사값이라 서버로 보내지 않는다.
 *
 * [1:1 문의하기]는 로그인이 필요하지만 비활성으로 두지 않는다 — 탭하면 로그인으로 보내고
 * 원래 액션을 이어서 실행한다.
 */
const ALL_CATEGORY = "ALL";
const BOTTOM_CTA_HEIGHT = 76;

export default function CustomerCenterView() {
  const navigation = useMypageNavigation();
  const { bottom } = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);

  const { data: categories } = useGetFaqCategories();
  const { data: faqs, isLoading } = useGetFaqList(
    selectedCategory === ALL_CATEGORY ? undefined : selectedCategory
  );

  const chipItems = useMemo(
    (): Array<FilterChipItem<string>> =>
      (categories ?? []).map(category => ({ value: category.key, label: category.description })),
    [categories]
  );

  const handlePressInquiry = usePermissionPress(() => {
    navigation.navigate(MYPAGE_ROUTES.INQUIRY_REGISTER);
  });

  const handleSelectCategory = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="고객센터" onPressBack={navigation.goBack} />

      <View className="border-b-[0.5px] border-divider py-6">
        <FilterChips items={chipItems} selectedValue={selectedCategory} onSelect={handleSelectCategory} />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottom + BOTTOM_CTA_HEIGHT }}
        >
          {(faqs ?? []).length === 0 ? (
            <View className="items-center px-30 pt-56">
              <Typography variant="caption" className="text-center text-gray45">
                해당 분류의 자주 묻는 질문이 아직 없어요.
              </Typography>
            </View>
          ) : (
            (faqs ?? []).map(faq => (
              <Accordion key={faq.id} label={faq.categoryName} title={faq.question} body={faq.answer} />
            ))
          )}
        </ScrollView>
      )}

      <View
        className="absolute bottom-0 left-0 right-0 border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ paddingBottom: bottom + 12 }}
      >
        <TouchableOpacity
          onPress={handlePressInquiry}
          activeOpacity={0.8}
          className="h-52 flex-row items-center justify-center rounded-base bg-rose"
        >
          <Typography variant="buttonPrimary" className="text-white">
            1:1 문의하기
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
