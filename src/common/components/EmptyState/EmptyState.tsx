import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

/**
 * 빈 목록 안내 — 아이콘 50~52(#D8D8DA) · 제목 15.5/600 · 설명 13/1.7 #737373.
 *
 * 문구는 **왜 비었는지**가 아니라 **무엇을 하면 채워지는지**를 적는다. 같은 빈 목록이라도
 * 필터 때문에 비었을 때와 정말 내역이 없을 때 할 일이 다르므로, 문구를 부르는 쪽이 정한다.
 *
 * 화면 한가운데가 아니라 위쪽(기본 100)에 두는 이유는, 목록 화면에서는 아래에 고정 버튼이
 * 있어 가운데 정렬하면 안내가 버튼에 눌려 내려앉아 보이기 때문이다.
 *
 * `actionLabel`은 **다음 행동이 하나로 정해질 때만** 준다(팔로잉 0 → 쇼룸 검색). 좋아요처럼
 * 어디서든 눌러 채우는 목록에는 버튼을 두지 않는다 — 보낼 곳이 하나로 좁혀지지 않는다.
 */
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  paddingTop?: number;
  /**
   * 목록이 통째로 비어 **화면에 이 안내밖에 없는** 경우 — 남는 세로 공간을 차지하고
   * 가운데 정렬한다. 위쪽에 붙여 두면 아래가 통채로 빈 화면이 되어 안내가 떠 보인다.
   *
   * 반대로 **아래에 다른 내용이 이어지는** 자리에는 주지 않는다(검색 결과 없음 → 추천 쇼룸,
   * 상품 상세의 문의 탭) — 가운데로 밀면 뒤따르는 내용이 한 화면 밖으로 밀려난다.
   *
   * 스크롤 목록 안에서 쓸 때는 부모에 `contentContainerStyle={{ flexGrow: 1 }}`이 함께 필요하다 —
   * 그게 없으면 내용 높이만큼만 잡혀 채울 공간이 생기지 않는다.
   */
  fill?: boolean;
  className?: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export default function EmptyState(props: EmptyStateProps) {
  const { icon, title, description, paddingTop, fill, className, actionLabel, onPressAction } = props;

  const resolvedPaddingTop = paddingTop ?? (fill ? 0 : 100);

  return (
    <View
      className={cn("items-center px-40", fill && "flex-1 justify-center", className)}
      style={{ paddingTop: resolvedPaddingTop }}
    >
      {icon}

      <Typography
        style={{ fontSize: 15.5, fontWeight: "600", lineHeight: 23.25, marginTop: 18 }}
        className="text-center text-ink"
      >
        {title}
      </Typography>

      {!!description && (
        <Typography
          style={{ fontSize: 13, lineHeight: 22.1, marginTop: 7 }}
          className="text-center text-gray45"
        >
          {description}
        </Typography>
      )}

      {!!actionLabel && !!onPressAction && (
        /* 콘텐츠 안에 놓이는 CTA는 45px/14 — 화면 하단 고정 CTA(52px/15.5)보다 한 단계 낮춘다 */
        <TouchableOpacity onPress={onPressAction} activeOpacity={0.75} style={{ marginTop: 22 }}>
          <View className="h-45 flex-row items-center justify-center rounded-base bg-rose px-22">
            <Typography style={{ fontSize: 14, fontWeight: "600", lineHeight: 14 }} className="text-white">
              {actionLabel}
            </Typography>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
