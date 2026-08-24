import { useCallback, useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Accordion from "@/common/components/Accordion/Accordion";
import { SearchIcon } from "@/common/components/DsIcon/icons";
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
  const [keyword, setKeyword] = useState("");

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

  /**
   * 검색은 받아 둔 목록에서 바로 거른다 — FAQ는 운영자가 고른 수십 건 규모라
   * 글자를 칠 때마다 서버를 두드릴 이유가 없다. 질문과 답변 본문을 모두 훑는다.
   */
  const visibleFaqs = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    const list = faqs ?? [];

    if (!trimmed) {
      return list;
    }
    return list.filter(
      faq => faq.question.toLowerCase().includes(trimmed) || faq.answer.toLowerCase().includes(trimmed)
    );
  }, [faqs, keyword]);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="고객센터" onPressBack={navigation.goBack} />

      <View className="px-14 pb-6 pt-18">
        <View className="h-40 flex-row items-center rounded-base bg-fill px-12" style={{ gap: 8 }}>
          <SearchIcon size={16} />
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="궁금한 내용을 검색해 보세요"
            placeholderTextColor="#8E8E8E"
            className="flex-1 p-0 text-14 text-ink"
          />
        </View>
      </View>

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
          {visibleFaqs.length === 0 ? (
            <View className="items-center px-40 pb-60 pt-56">
              <SearchIcon size={50} color="#D8D8DA" />
              <Typography
                style={{ fontSize: 15.5, fontWeight: "600", lineHeight: 23.25, marginTop: 18 }}
                className="text-center text-ink"
              >
                {keyword.trim()
                  ? `'${keyword.trim()}'에 대한 결과가 없어요`
                  : "해당 분류의 질문이 아직 없어요"}
              </Typography>
              <Typography
                style={{ fontSize: 13, lineHeight: 22.1, marginTop: 7 }}
                className="text-center text-gray55"
              >
                {"다른 검색어로 찾아보거나\n아래에서 바로 문의할 수 있어요"}
              </Typography>
            </View>
          ) : (
            visibleFaqs.map(faq => (
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
