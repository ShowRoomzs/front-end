import dayjs from "dayjs";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { htmlToText } from "@/common/utils/htmlToText";
import useGetNoticeDetail from "@/features/notice/hooks/useGetNoticeDetail";
import { NoticeListItem } from "@/features/notice/types/notice";

/**
 * 공지 한 줄 — 탭하면 본문이 그 자리에서 펼쳐진다.
 *
 * 본문은 펼칠 때 받아온다. 목록만으로 읽을지 말지 정하는 화면이라, 열지 않을 공지의 본문까지
 * 미리 받아 둘 이유가 없다.
 */
interface NoticeAccordionProps {
  item: NoticeListItem;
}

export default function NoticeAccordion(props: NoticeAccordionProps) {
  const { item } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { data: detail, isLoading } = useGetNoticeDetail(isOpen ? item.id : undefined);

  return (
    <View className="border-b-[0.5px] border-dividerProduct bg-white">
      <TouchableOpacity
        onPress={() => setIsOpen(prev => !prev)}
        activeOpacity={0.7}
        className="flex-row items-start px-14 py-14"
        style={{ gap: 10 }}
      >
        <View className="min-w-0 flex-1">
          <Typography
            style={{ fontSize: 11, fontWeight: "600", lineHeight: 16, marginBottom: 3 }}
            className="text-gray45"
          >
            {dayjs(item.createdDate).format("YYYY.MM.DD")}
          </Typography>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            {item.pinned && (
              <Typography style={{ fontSize: 11, fontWeight: "600", lineHeight: 16 }} className="text-rose">
                [중요]
              </Typography>
            )}
            <Typography
              variant={isOpen ? "accordionQuestionOpen" : "accordionQuestion"}
              className="min-w-0 flex-1 text-ink"
            >
              {item.title}
            </Typography>
          </View>
        </View>
        <View style={{ marginTop: 4 }}>
          <ChevronDownIcon
            size={14}
            color="#C7C7C7"
            style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View className="bg-band px-14 py-14">
          {isLoading || !detail ? (
            <Spinner size={18} />
          ) : (
            <Typography variant="accordionAnswer" className="text-ink76">
              {htmlToText(detail.content)}
            </Typography>
          )}
        </View>
      )}
    </View>
  );
}
