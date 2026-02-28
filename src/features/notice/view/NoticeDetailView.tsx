import { RouteProp, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { ScrollView, View } from "react-native";

import NoticeListHeader from "../components/NoticeListHeader/NoticeListHeader";
import useGetNoticeDetail from "../hooks/useGetNoticeDetail";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { MypageStackParamList } from "@/common/router/types";

export default function NoticeDetailView() {
  const { params } = useRoute<RouteProp<MypageStackParamList, typeof MYPAGE_ROUTES.NOTICE_DETAIL>>();
  const { noticeId } = params;
  const navigation = useMypageNavigation();
  const { show: showBottomTab, hide: hideBottomTab } = useBottomTab();

  const { data: noticeDetail } = useGetNoticeDetail(noticeId);

  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    hideBottomTab();
    return () => {
      showBottomTab();
    };
  }, [hideBottomTab, showBottomTab]);

  return (
    <View className="flex-1 bg-white">
      <NoticeListHeader onPressBack={handlePressBack} wrapperClassName="px-20" />
      <ScrollView>
        {noticeDetail && (
          <View className="px-20 py-24">
            <VStack gap={10}>
              <Typography className="text-16 font-semibold text-black">{noticeDetail.title}</Typography>
              <Typography className="text-13 font-normal text-gray7">
                {dayjs(noticeDetail.createdDate).format("YYYY.MM.DD HH:mm")}
              </Typography>
            </VStack>
            <Typography className="mt-20 text-14 font-normal text-black leading-6">
              {noticeDetail.content}
            </Typography>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
