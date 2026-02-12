import { useCallback } from "react";
import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import Icon from "@/common/components/Icon/Icon";
import Search from "@/common/components/Search/Search";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { SEARCH_MAX_LENGTH } from "@/features/search/components/SearchHeader/config";

interface SearchHeaderProps {
  onPressBack: () => void;
  onSearch: (keyword: string) => void;
  wrapperClassName?: string;
  keyword: string;
  onChangeKeyword?: (keyword: string) => void;
  onPressSearch?: () => void;
  readOnly?: boolean;
}
export default function SearchHeader(props: SearchHeaderProps) {
  const { keyword, onPressBack, onSearch, wrapperClassName, onChangeKeyword, onPressSearch, readOnly } =
    props;

  const handleChangeKeyword = useCallback(
    (text: string) => {
      onChangeKeyword?.(text);
    },
    [onChangeKeyword]
  );

  const handleSubmitEditing = useCallback(() => {
    if (keyword.length === 0) {
      return;
    }
    onSearch(keyword);
  }, [keyword, onSearch]);

  return (
    <Header
      className={wrapperClassName}
      renderLeft={
        <TouchableOpacity onPress={onPressBack} activeOpacity={0.7}>
          <Icon icon={COMMON_ASSETS.back} />
        </TouchableOpacity>
      }
      title={
        <Search
          renderPreFix={<Icon icon={COMMON_ASSETS.search} />}
          value={keyword}
          onChangeText={handleChangeKeyword}
          className="flex-1"
          placeholder="검색어를 입력해 주세요"
          onSubmitEditing={handleSubmitEditing}
          maxLength={SEARCH_MAX_LENGTH}
          onPressSearch={onPressSearch}
          readOnly={readOnly}
        />
      }
    />
  );
}
