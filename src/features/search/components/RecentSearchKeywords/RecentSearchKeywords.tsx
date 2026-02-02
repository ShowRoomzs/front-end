import { useCallback } from "react";
import { FlatList } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { cn } from "@/common/utils/cn";
import RecentSearchChipButton from "@/features/search/components/RecentSearchChipButton/RecentSearchChipButton";
import { RecentSearchItem } from "@/features/search/types/recentSearch";

interface RecentSearchKeywordsProps {
  keywords: Array<RecentSearchItem>;
  wrapperClassName?: string;
  onPressKeyword: (keyword: string) => void;
  onDeleteKeyword: (keywordId: string | number) => void;
}
export default function RecentSearchKeywords(props: RecentSearchKeywordsProps) {
  const { keywords, wrapperClassName, onPressKeyword, onDeleteKeyword } = props;

  const renderItem = useCallback(
    ({ item }: { item: RecentSearchItem }) => {
      return <RecentSearchChipButton item={item} onPress={onPressKeyword} onDelete={onDeleteKeyword} />;
    },
    [onPressKeyword, onDeleteKeyword]
  );

  return (
    <VStack gap={8} className={cn("flex flex-col", wrapperClassName)}>
      <Typography className="text-black text-12 font-medium px-20">최근 검색어</Typography>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
        data={keywords}
        renderItem={renderItem}
      />
    </VStack>
  );
}
