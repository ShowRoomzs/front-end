import { useCallback, useMemo } from "react";
import { FlatList, Pressable, View } from "react-native";

import HighlightTypo from "@/common/components/HighlightTypo/HighlightTypo";
import { useGetAutoComplete } from "@/features/search/hooks/useGetAutoComplete";
import { AutoCompleteItem } from "@/features/search/types/autoComplete";

interface AutoCompleteViewProps {
  keyword: string;
  onPressKeyword: (item: AutoCompleteItem) => void;
}
export default function AutoCompleteView(props: AutoCompleteViewProps) {
  const { keyword, onPressKeyword } = props;
  const { data: autoCompleteResponse } = useGetAutoComplete(keyword);

  const keywords = useMemo(
    () => [
      ...(autoCompleteResponse?.products || []),
      ...(autoCompleteResponse?.markets || []),
      ...(autoCompleteResponse?.showrooms || []),
    ],
    [autoCompleteResponse?.markets, autoCompleteResponse?.products, autoCompleteResponse?.showrooms]
  );

  const renderItem = useCallback(
    ({ item }: { item: AutoCompleteItem }) => {
      return (
        <Pressable onPress={() => onPressKeyword(item)} className="flex justify-center w-full h-37">
          <HighlightTypo
            keyword={keyword}
            className="text-14 font-normal"
            highlightClassName="text-pointColor"
          >
            {item.name}
          </HighlightTypo>
        </Pressable>
      );
    },
    [keyword, onPressKeyword]
  );

  return (
    <View className="flex-1 border-t-[1px] border-gray2 mt-10">
      <FlatList
        className="px-20 py-10"
        contentContainerStyle={{ gap: 10 }}
        data={keywords}
        renderItem={renderItem}
      />
    </View>
  );
}
