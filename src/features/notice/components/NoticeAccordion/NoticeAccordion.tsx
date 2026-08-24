import dayjs from "dayjs";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import Badge from "@/common/components/Badge/Badge";
import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { htmlToText } from "@/common/utils/htmlToText";
import useGetNoticeDetail from "@/features/notice/hooks/useGetNoticeDetail";
import { NoticeListItem } from "@/features/notice/types/notice";

/**
 * 공지 한 줄 — 탭하면 본문이 그 자리에서 펼쳐진다 (C17).
 *
 * 본문은 펼칠 때 받아온다. 목록만으로 읽을지 말지 정하는 화면이라, 열지 않을 공지의 본문까지
 * 미리 받아 둘 이유가 없다.
 *
 * [중요]는 로즈 채움 배지다 — 공지 목록에서 지금 꼭 읽어야 하는 것을 가리키는 신호라
 * 배지 규격(R8 · 11/600)을 그대로 쓴다. 날짜는 그 옆에 한 단계 흐리게 둔다.
 */
interface NoticeAccordionProps {
  item: NoticeListItem;
}

export default function NoticeAccordion(props: NoticeAccordionProps) {
  const { item } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { data: detail, isLoading } = useGetNoticeDetail(isOpen ? item.id : undefined);

  return (
    <View className="border-t-[0.5px] border-dividerProduct bg-white">
      <TouchableOpacity
        onPress={() => setIsOpen(prev => !prev)}
        activeOpacity={0.7}
        className="flex-row items-start px-14 py-16"
        style={{ gap: 10 }}
      >
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center" style={{ gap: 6 }}>
            {item.pinned && <Badge label="중요" variant="rose" />}
            <Typography style={{ fontSize: 11.5, lineHeight: 11.5 }} className="text-gray45">
              {dayjs(item.createdDate).format("YYYY.MM.DD")}
            </Typography>
          </View>

          <Typography
            style={{ fontSize: 14.5, fontWeight: isOpen ? "600" : "400", lineHeight: 21, marginTop: 7 }}
            className="text-ink"
          >
            {item.title}
          </Typography>
        </View>

        {/* 제목 줄에 시선이 맞도록 아래로 내린다 — 배지·날짜 줄이 위에 한 줄 더 있다 */}
        <View style={{ marginTop: 22 }}>
          <ChevronDownIcon
            size={14}
            color="#C7C7C7"
            style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View className="bg-band" style={{ paddingHorizontal: 14, paddingTop: 16, paddingBottom: 18 }}>
          {isLoading || !detail ? (
            <Spinner size={18} />
          ) : (
            <Typography style={{ fontSize: 13.5, lineHeight: 23.6 }} className="text-ink76">
              {htmlToText(detail.content)}
            </Typography>
          )}
        </View>
      )}
    </View>
  );
}
