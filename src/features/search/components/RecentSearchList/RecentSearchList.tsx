import { TouchableOpacity, View } from "react-native";

import { CloseIcon, SearchIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { RecentSearchItem } from "@/features/search/types/recentSearch";

/**
 * 최근 검색 — 인스타 형식의 세로 리스트.
 *
 * 알약형(radius full) 칩을 쓰지 않는다. 삭제 가능한 항목 목록은 목록형 행으로 통일하고,
 * 칩은 배타 선택 필터에만 쓴다.
 *
 * 검색어 행은 Fill 원 44 안에 돋보기 19 + 단어 한 줄이고, 탭하면 그 단어로 재검색한다.
 * 우측 개별 삭제 X는 14px 아이콘에 44×44 히트 영역을 확보한다.
 */
interface RecentSearchListProps {
  items: Array<RecentSearchItem>;
  onPressKeyword: (keyword: string) => void;
  onDeleteKeyword: (id: string | number) => void;
}

const DELETE_HIT_SLOP_PADDING = 15;

export default function RecentSearchList(props: RecentSearchListProps) {
  const { items, onPressKeyword, onDeleteKeyword } = props;

  if (items.length === 0) {
    return (
      <View className="items-center px-30 pt-72">
        <SearchIcon size={32} color="#C7C7C7" />
        <Typography
          style={{ fontSize: 14, fontWeight: "600", lineHeight: 21, marginTop: 14 }}
          className="text-ink"
        >
          최근 검색 기록이 없어요
        </Typography>
        <Typography
          variant="caption"
          style={{ lineHeight: 20, marginTop: 5 }}
          className="text-center text-gray45"
        >
          {"쇼룸 이름이나 아이디로 검색하면\n여기에 기록이 남아요"}
        </Typography>
      </View>
    );
  }

  return (
    <View>
      {items.map(item => (
        <TouchableOpacity
          key={String(item.id)}
          onPress={() => onPressKeyword(item.term)}
          activeOpacity={0.6}
          className="flex-row items-center px-14 py-8"
          style={{ gap: 12 }}
        >
          <View className="h-44 w-44 items-center justify-center rounded-full bg-fill">
            <SearchIcon size={19} />
          </View>
          <Typography variant="rowName" className="min-w-0 flex-1 text-ink" numberOfLines={1}>
            {item.term}
          </Typography>
          <TouchableOpacity
            onPress={() => onDeleteKeyword(item.id)}
            activeOpacity={0.6}
            style={{ padding: DELETE_HIT_SLOP_PADDING, margin: -DELETE_HIT_SLOP_PADDING }}
          >
            <CloseIcon size={14} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
}
