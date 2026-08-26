import { TouchableOpacity, View } from "react-native";

import { CloseIcon, SearchIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import Typography from "@/common/components/Typography/Typography";
import { RecentSearchItem } from "@/features/search/types/recentSearch";
import ShowroomRow from "@/features/showroom/components/ShowroomRow/ShowroomRow";

/**
 * 최근 검색 — 인스타 형식의 세로 리스트. **쇼룸과 검색어가 한 목록에 섞인다.**
 *
 * 알약형(radius full) 칩을 쓰지 않는다. 삭제 가능한 항목 목록은 목록형 행으로 통일하고,
 * 칩은 배타 선택 필터에만 쓴다.
 *
 * - **쇼룸 행** 아바타 44(공구 진행 중이면 로즈 링) + 이름 + @handle. 탭하면 바로 C4 쇼룸으로 간다
 * - **검색어 행** Fill 원 44 안에 돋보기 19 + 단어 한 줄. 탭하면 그 단어로 재검색한다
 *
 * 두 행이 같은 높이(아바타 44 · 상하 8)를 쓰는 것은 목록의 리듬을 깨지 않기 위해서다.
 * 우측 개별 삭제 X는 14px 아이콘에 44×44 히트 영역을 확보한다.
 */
interface RecentSearchListProps {
  items: Array<RecentSearchItem>;
  onPressKeyword: (keyword: string) => void;
  onPressShowroom: (showroomId: number) => void;
  onDeleteKeyword: (id: string | number) => void;
}

const DELETE_HIT_SLOP_PADDING = 15;

export default function RecentSearchList(props: RecentSearchListProps) {
  const { items, onPressKeyword, onPressShowroom, onDeleteKeyword } = props;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<SearchIcon size={50} color="#D8D8DA" />}
        title="최근 검색 기록이 없어요"
        description={"쇼룸 이름이나 아이디로 검색하면\n여기에 기록이 남아요"}
        paddingTop={72}
      />
    );
  }

  return (
    <View>
      {items.map(item => (
        <View key={String(item.id)} className="flex-row items-center">
          <View className="min-w-0 flex-1">
            {item.showroom ? (
              <ShowroomRow
                showroomId={item.showroom.showroomId}
                showroomName={item.showroom.showroomName}
                showroomImageUrl={item.showroom.showroomImageUrl}
                hasOngoingGroupBuy={item.showroom.hasOngoingGroupBuy}
                handle={item.showroom.showroomAddress}
                onPress={onPressShowroom}
              />
            ) : (
              <TouchableOpacity
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
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => onDeleteKeyword(item.id)}
            activeOpacity={0.6}
            style={{ padding: DELETE_HIT_SLOP_PADDING, marginRight: 14 - DELETE_HIT_SLOP_PADDING }}
          >
            <CloseIcon size={14} color="#C7C7C7" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
