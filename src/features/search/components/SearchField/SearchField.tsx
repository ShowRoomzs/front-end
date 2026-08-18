import { TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { CloseIcon, SearchIcon } from "@/common/components/DsIcon/icons";

/**
 * C14 검색 필드 — 높이 40 · R8 · Fill(#F4F4F5).
 *
 * 플레이스홀더 #8E8E8E, 입력 상태는 값 잉크 + 우측 지우기(⊗ 17px 원 #9E9E9E).
 * 지우기 버튼은 시각 크기를 키우지 않고 히트 영역만 44로 넓힌다.
 */
interface SearchFieldProps {
  keyword: string;
  placeholder?: string;
  onChangeKeyword: (keyword: string) => void;
  onSubmit?: () => void;
  onPressBack: () => void;
}

const CLEAR_HIT_SLOP_PADDING = 13;

export default function SearchField(props: SearchFieldProps) {
  const {
    keyword,
    placeholder = "쇼룸 이름 또는 아이디로 검색",
    onChangeKeyword,
    onSubmit,
    onPressBack,
  } = props;

  return (
    <View className="flex-row items-center bg-white pb-12 pt-2" style={{ paddingRight: 16, gap: 6 }}>
      <TouchableOpacity onPress={onPressBack} activeOpacity={0.4} className="p-11">
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 5l-7 7 7 7"
            stroke="#0F0F0F"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      <View className="h-40 flex-1 flex-row items-center rounded-base bg-fill px-12" style={{ gap: 8 }}>
        <SearchIcon size={19} />
        <TextInput
          value={keyword}
          onChangeText={onChangeKeyword}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor="#8E8E8E"
          returnKeyType="search"
          autoFocus
          className="flex-1 p-0 text-14 text-ink"
        />
        {keyword.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeKeyword("")}
            activeOpacity={0.6}
            style={{ padding: CLEAR_HIT_SLOP_PADDING, margin: -CLEAR_HIT_SLOP_PADDING }}
          >
            <View
              className="items-center justify-center rounded-full"
              style={{ width: 17, height: 17, backgroundColor: "#9E9E9E" }}
            >
              <CloseIcon size={9} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
