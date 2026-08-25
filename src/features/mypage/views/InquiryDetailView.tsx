import { RouteProp, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { Image, ScrollView, View } from "react-native";

import Avatar from "@/common/components/Avatar/Avatar";
import GroupBand from "@/common/components/GroupBand/GroupBand";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { MypageStackParamList } from "@/common/router/types";
import { useGetInquiryDetail } from "@/features/inquiry/hooks/useGetInquiryDetail";
import InquiryItemMetaRow from "@/features/mypage/components/InquiryItemMetaRow/InquiryItemMetaRow";
import InquiryOrderCard from "@/features/mypage/components/InquiryOrderCard/InquiryOrderCard";

/**
 * C12 1:1 문의 상세 — 머리(상태·유형·날짜) → 연결된 주문 → 내 문의 → 답변.
 *
 * 채팅 버블(좌우 정렬)을 쓰지 않는 이유는 문의가 **실시간 대화가 아니라 하루 단위 왕복**이고,
 * 버블은 짧은 대화에 맞는 형식이라 긴 답변에서는 가독성이 떨어지기 때문이다. 답변만 회색
 * 블록으로 감싸 내 글과 구분한다.
 *
 * 주문 카드는 **눌러도 이동하지 않는다** — 소비자 앱에 주문 상세 화면이 아직 없다.
 * 셰브런을 그리지 않는 것으로 "여기서 끝"임을 알린다.
 */
const TIMESTAMP_FORMAT = "YYYY.MM.DD HH:mm";
const PHOTO_SIZE = 72;

export default function InquiryDetailView() {
  const navigation = useMypageNavigation();
  const route = useRoute<RouteProp<MypageStackParamList, typeof MYPAGE_ROUTES.INQUIRY_DETAIL>>();
  const { inquiryId } = route.params;

  const { data: inquiry, isLoading } = useGetInquiryDetail(inquiryId);

  if (isLoading || !inquiry) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="문의 상세" onPressBack={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="문의 상세" onPressBack={navigation.goBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-14 pb-16 pt-18">
          <InquiryItemMetaRow
            status={inquiry.status}
            typeName={inquiry.typeName}
            date={dayjs(inquiry.createdAt).format("YYYY.MM.DD")}
          />

          {!!inquiry.order && (
            <View style={{ marginTop: 12 }}>
              <InquiryOrderCard order={inquiry.order} size="md" />
            </View>
          )}
        </View>

        <GroupBand height={8} />

        <View className="px-14 pt-18">
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <Avatar imageUrl={inquiry.writerProfileImageUrl} size={28} />
            <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink">
              {inquiry.writerNickname}
            </Typography>
            <Typography style={{ fontSize: 11.5, lineHeight: 11.5 }} className="text-gray45">
              {dayjs(inquiry.createdAt).format(TIMESTAMP_FORMAT)}
            </Typography>
          </View>

          <Typography style={{ fontSize: 14, lineHeight: 24.5, marginTop: 10 }} className="text-ink">
            {inquiry.content}
          </Typography>

          {inquiry.imageUrls.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
              style={{ marginTop: 12 }}
            >
              {inquiry.imageUrls.map(url => (
                <Image
                  key={url}
                  source={{ uri: url }}
                  className="rounded-base"
                  style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View className="px-14 pt-20">
          {inquiry.answerContent ? (
            <View className="rounded-base bg-band p-14">
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink">
                  {inquiry.answererName}
                </Typography>
                <Typography style={{ fontSize: 11.5, lineHeight: 11.5 }} className="text-gray45">
                  {inquiry.answeredAt ? dayjs(inquiry.answeredAt).format(TIMESTAMP_FORMAT) : ""}
                </Typography>
              </View>

              <Typography style={{ fontSize: 14, lineHeight: 24.5, marginTop: 11 }} className="text-ink76">
                {inquiry.answerContent}
              </Typography>
            </View>
          ) : (
            /* 참고 고지는 아이콘 없이 11.5/1.7 #737373 — 디자인 시스템 05 안내 배너 */
            <Typography
              style={{ fontSize: 11.5, lineHeight: 19.55 }}
              className="rounded-base bg-band p-13 text-gray45"
            >
              아직 답변이 등록되지 않았어요. 답변이 등록되면 알림으로 알려드려요.
            </Typography>
          )}
        </View>

        <View className="h-26" />
      </ScrollView>
    </View>
  );
}
