import dayjs from "dayjs";
import { TouchableOpacity, View } from "react-native";

import { ChevronDownIcon, LockIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { PublicProductInquiry } from "@/features/product/types/productInquiry";
import { maskAuthorName } from "@/features/product/utils/maskAuthorName";

/**
 * 공개 문의 한 건 — 아코디언 (시안 C7 문의 탭 · C7-2 문의 전체).
 *
 * 순서는 **유형 배지(좌) · 답변 상태(우) → 질문 → 작성자·날짜 → 답변 블록**이다.
 * 작성 화면에서 고른 유형이 그대로 목록의 첫 단서가 된다.
 *
 * 접힌 상태에서 질문을 **1줄**로 자른다. 두 줄이면 항목이 카드처럼 읽혀 몇 건이 있는지
 * 가늠이 안 되고, 답변까지 모두 펼쳐 두면 3건만으로 화면이 다 찬다.
 *
 * **답변 상태는 배지가 아니라 텍스트**이고 완료는 잉크 · 대기는 회색이다 — 완료는 읽을 것이
 * 있다는 확정된 정보이고, 대기는 아직 비어 있는 상태라 위계를 한 단계 낮춘다.
 *
 * **비밀글은 지우지 않는다.** 자물쇠 + 회색 대체 문구로 자리를 남긴다 — 숨기면 머리의 건수와
 * 목록의 줄 수가 어긋나고, 글을 쓴 사람도 자기 문의가 접수됐는지 확인할 수 없다.
 * 본문은 애초에 서버가 내려주지 않아야 하므로, 대체 문구는 **화면이** 채운다.
 */
interface ProductInquiryItemProps {
  inquiry: PublicProductInquiry;
  /** 답변 블록의 이름 — 답하는 주체는 운영팀이 아니라 판매자다 */
  sellerName: string;
  isExpanded: boolean;
  onToggle: (inquiryId: number) => void;
}

const SECRET_PLACEHOLDER = "비밀글입니다. 작성자와 판매자만 볼 수 있어요";

/** 펼쳤을 때의 최대 줄 수 — 무제한으로 두면 긴 문의 하나가 목록을 통째로 밀어낸다 */
const EXPANDED_LINE_CLAMP = 8;

const DATE_FORMAT = "YYYY.MM.DD";

export default function ProductInquiryItem(props: ProductInquiryItemProps) {
  const { inquiry, sellerName, isExpanded, onToggle } = props;

  const isAnswered = inquiry.status === "ANSWERED";
  /** 비밀글은 펼칠 내용이 없고, 미답변은 아직 드러날 답변이 없다 */
  const isExpandable = isAnswered && !inquiry.secret;
  const isOpen = isExpandable && isExpanded;

  return (
    <View style={{ borderTopWidth: 0.5, borderTopColor: "#F0F0F0" }}>
      <TouchableOpacity
        onPress={() => onToggle(inquiry.id)}
        disabled={!isExpandable}
        activeOpacity={0.7}
        className="px-14"
        style={{ paddingVertical: 16 }}
      >
        <View className="flex-row items-center" style={{ gap: 7 }}>
          <View className="rounded-base bg-fill" style={{ paddingVertical: 4, paddingHorizontal: 8 }}>
            <Typography style={{ fontSize: 11, fontWeight: "600", lineHeight: 11 }} className="text-gray45">
              {inquiry.typeName}
            </Typography>
          </View>

          <View className="flex-1" />

          <Typography
            style={{ fontSize: 11.5, fontWeight: "600", lineHeight: 11.5 }}
            className={isAnswered ? "text-ink" : "text-gray55"}
          >
            {isAnswered ? "답변 완료" : "답변 대기"}
          </Typography>
        </View>

        <View className="flex-row items-start" style={{ gap: 8, marginTop: 10 }}>
          {inquiry.secret && (
            <View style={{ marginTop: 3 }}>
              <LockIcon size={15} color="#8E8E8E" />
            </View>
          )}

          <Typography
            style={{ fontSize: 14, lineHeight: 22.4 }}
            className={`min-w-0 flex-1 ${inquiry.secret ? "text-gray55" : "text-ink"}`}
            numberOfLines={isOpen ? EXPANDED_LINE_CLAMP : 1}
          >
            {inquiry.secret ? SECRET_PLACEHOLDER : inquiry.content}
          </Typography>

          {isExpandable && (
            <ChevronDownIcon
              size={14}
              color="#C7C7C7"
              style={{ marginTop: 4, transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
            />
          )}
        </View>

        <Typography style={{ fontSize: 11.5, lineHeight: 11.5, marginTop: 7 }} className="text-gray45">
          {`${maskAuthorName(inquiry.authorName)} · ${dayjs(inquiry.createdAt).format(DATE_FORMAT)}`}
        </Typography>
      </TouchableOpacity>

      {isOpen && (
        <View className="px-14" style={{ paddingBottom: 16 }}>
          <View className="rounded-base bg-band" style={{ padding: 13 }}>
            {/*
              브랜드명 옆에 "판매자"를 붙이고 우측에 답변일을 적는다 — 질문일과 답변일 사이
              간격이 곧 응대 속도라, 구매자가 실제로 확인하는 정보다.
            */}
            <View className="flex-row items-baseline" style={{ gap: 6 }}>
              <Typography
                style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }}
                className="min-w-0 shrink text-ink76"
                numberOfLines={1}
              >
                {sellerName}
              </Typography>
              <Typography style={{ fontSize: 11, lineHeight: 11 }} className="text-gray55">
                판매자
              </Typography>

              <View className="flex-1" />

              {!!inquiry.answeredAt && (
                <Typography style={{ fontSize: 11, lineHeight: 11 }} className="text-gray55">
                  {dayjs(inquiry.answeredAt).format(DATE_FORMAT)}
                </Typography>
              )}
            </View>

            <Typography style={{ fontSize: 13.5, lineHeight: 22.95, marginTop: 8 }} className="text-ink76">
              {inquiry.answerContent}
            </Typography>
          </View>
        </View>
      )}
    </View>
  );
}
