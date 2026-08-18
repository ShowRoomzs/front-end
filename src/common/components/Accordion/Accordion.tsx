import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * 아코디언 — 고객센터 FAQ · 공지사항이 공유한다.
 *
 * Q 마커 로즈 · 유형 라벨 11/600 #737373 · 질문 14.5(펼침 600 / 접힘 400) ·
 * 셰브런 14 #C7C7C7이 열릴 때 180° 회전. 답변 블록은 배경 #F7F7F8 · A 마커 #737373 ·
 * 본문 13.5/1.7 #3C3C3C.
 *
 * 행 사이는 0.5px #F0F0F0 — 아코디언은 열림/닫힘 경계가 필요하므로 헤어라인을 쓰는 예외다.
 */
interface AccordionProps {
  /** 질문 위에 붙는 유형 라벨(FAQ 카테고리 · 공지 등록일) */
  label?: string;
  title: string;
  body: string;
  /** Q/A 마커를 그릴지 — 공지사항은 마커 없이 본문만 편다 */
  withMarker?: boolean;
  /** 제목 앞에 붙는 배지(공지의 [중요]) */
  badge?: string;
}

export default function Accordion(props: AccordionProps) {
  const { label, title, body, withMarker = true, badge } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="border-b-[0.5px] border-dividerProduct bg-white">
      <TouchableOpacity
        onPress={() => setIsOpen(prev => !prev)}
        activeOpacity={0.7}
        className="flex-row items-start px-14 py-14"
        style={{ gap: 10 }}
      >
        {withMarker && (
          <Typography style={{ fontSize: 14.5, fontWeight: "700", lineHeight: 21.75 }} className="text-rose">
            Q
          </Typography>
        )}

        <View className="min-w-0 flex-1">
          {!!label && (
            <Typography
              style={{ fontSize: 11, fontWeight: "600", lineHeight: 16, marginBottom: 3 }}
              className="text-gray45"
            >
              {label}
            </Typography>
          )}
          <View className="flex-row items-center" style={{ gap: 6 }}>
            {!!badge && (
              <Typography style={{ fontSize: 11, fontWeight: "600", lineHeight: 16 }} className="text-rose">
                [{badge}]
              </Typography>
            )}
            <Typography
              variant={isOpen ? "accordionQuestionOpen" : "accordionQuestion"}
              className="min-w-0 flex-1 text-ink"
            >
              {title}
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
        <View className="flex-row bg-band px-14 py-14" style={{ gap: 10 }}>
          {withMarker && (
            <Typography
              style={{ fontSize: 14.5, fontWeight: "700", lineHeight: 22.95 }}
              className="text-gray45"
            >
              A
            </Typography>
          )}
          <Typography variant="accordionAnswer" className="min-w-0 flex-1 text-ink76">
            {body}
          </Typography>
        </View>
      )}
    </View>
  );
}
