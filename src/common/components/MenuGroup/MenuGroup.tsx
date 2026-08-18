import { TouchableOpacity, View } from "react-native";

import { ChevronRightIcon } from "@/common/components/DsIcon/icons";
import SectionLabel from "@/common/components/SectionLabel/SectionLabel";
import Typography from "@/common/components/Typography/Typography";

/**
 * 메뉴 그룹 — 마이(C 마이)와 설정(C15)이 함께 쓴다.
 *
 * 그룹 안에서 액션 항목은 15/500, 열람만 하는 도움말은 14.5/400 회색으로 낮춘다.
 *
 * 로그인이 필요한 항목도 일반 항목과 동일하게 표시한다 — 회색 처리·"로그인 필요" 꼬리표·
 * 비활성 스타일을 쓰지 않고, 탭하면 로그인으로 보낸 뒤 원래 목적지로 복귀시킨다.
 * 잠긴 것처럼 보이는 행은 탭을 시도하지 않게 만들어 전환을 떨어뜨린다.
 */
export interface MenuItem {
  key: string;
  label: string;
  /** 열람만 하는 항목(도움말) — 한 단계 낮춘 서체를 쓴다 */
  isPassive?: boolean;
  /** 우측에 값만 표시하고 이동하지 않는 항목(버전 정보) */
  value?: string;
  onPress?: () => void;
}

interface MenuGroupProps {
  title: string;
  items: Array<MenuItem>;
}

export default function MenuGroup(props: MenuGroupProps) {
  const { title, items } = props;

  return (
    <View className="bg-white">
      <SectionLabel label={title} className="pb-2 pt-16" />
      {items.map(item => (
        <TouchableOpacity
          key={item.key}
          onPress={item.onPress}
          disabled={!item.onPress}
          activeOpacity={0.6}
          className="flex-row items-center justify-between px-14 py-13"
        >
          <Typography
            variant={item.isPassive ? "menuPassive" : "menuAction"}
            className={item.isPassive ? "text-gray45" : "text-ink"}
          >
            {item.label}
          </Typography>
          {item.value ? (
            <Typography style={{ fontSize: 13, lineHeight: 18 }} className="text-gray55">
              {item.value}
            </Typography>
          ) : (
            !!item.onPress && <ChevronRightIcon size={16} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
