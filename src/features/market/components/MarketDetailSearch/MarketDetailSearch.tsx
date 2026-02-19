import { useState } from "react";

import HStack from "@/common/components/HStack/HStack";
import Search from "@/common/components/Search/Search";
import { cn } from "@/common/utils/cn";
import SortChipButton from "@/features/market/components/SortChipButton/SortChipButton";

interface MarketDetailSearchProps {
  onPressSearch: (keyword: string) => void;
  wrapperClassName?: string;
  onPressChipButton: () => void;
  sortLabel: string;
}
export default function MarketDetailSearch(props: MarketDetailSearchProps) {
  const { onPressSearch, wrapperClassName, onPressChipButton, sortLabel } = props;

  const [keyword, setKeyword] = useState("");

  return (
    <HStack className={cn(wrapperClassName, "items-center")} gap={10}>
      <Search
        value={keyword}
        className="flex-1"
        wrapperClassName="bg-gray0 h-34"
        onChangeText={setKeyword}
        onSubmitEditing={() => onPressSearch(keyword)}
        onPressSearch={() => onPressSearch(keyword)}
        returnKeyType="search"
        placeholder="검색어를 입력해주세요"
        size="medium"
      />
      <SortChipButton label={sortLabel} onPress={onPressChipButton} />
    </HStack>
  );
}
