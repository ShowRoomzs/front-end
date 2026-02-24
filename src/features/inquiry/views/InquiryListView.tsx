import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react"; // ✅ useEffect 추가
import { FlatList, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import InquiryListItem from "../components/InquiryListItem/InquiryListItem";
import { useGetInquiries } from "../hooks/useGetInquiries";
import { useDeleteInquiryMutation } from "../hooks/useInquiryMutation/useDeleteInquiryMutation";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { useBottomTab } from "@/common/hooks/useBottomTab";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

export default function InquiryListView() {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();

  // ✅ 팔로잉 페이지와 동일한 네이밍으로 가져오기
  const { show: showBottomTab, hide: hideBottomTab } = useBottomTab();

  // ✅ 진입 시 숨기고, 이탈(뒤로가기) 시 다시 보여주는 완벽한 패턴
  useEffect(() => {
    hideBottomTab();
    return () => {
      showBottomTab();
    };
  }, [hideBottomTab, showBottomTab]);

  const [activeTab, setActiveTab] = useState<"PRODUCT" | "ONE_ON_ONE">("ONE_ON_ONE");

  const { data: inquiryPageData } = useGetInquiries({ page: 1, limit: 10 });
  const { mutateAsync: deleteInquiry } = useDeleteInquiryMutation();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressEdit = useCallback((id: number) => {
    console.log("수정 클릭:", id);
  }, []);

  const handlePressDelete = useCallback(
    async (id: number) => {
      await deleteInquiry(id);
    },
    [deleteInquiry]
  );

  const handleWriteInquiry = useCallback(() => {
    navigation.navigate(MYPAGE_ROUTES.INQUIRY_REGISTER as never);
  }, [navigation]);

  return (
    <View className="flex-1 bg-white">
      <HStack className="items-center px-20 py-16">
        <TouchableOpacity onPress={handleBack}>
          <Icon icon={COMMON_ASSETS.back} width={24} height={24} />
        </TouchableOpacity>
        <Typography className="flex-1 text-center text-16 font-semibold mr-24">문의 내역</Typography>
      </HStack>

      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={cn(
            "flex-1 py-12 items-center justify-center",
            activeTab === "PRODUCT" && "border-b-2 border-gray-900"
          )}
          onPress={() => setActiveTab("PRODUCT")}
        >
          <Typography
            className={cn("text-14", activeTab === "PRODUCT" ? "text-gray-900 font-bold" : "text-gray-400")}
          >
            상품 문의 내역
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          className={cn(
            "flex-1 py-12 items-center justify-center",
            activeTab === "ONE_ON_ONE" && "border-b-2 border-gray-900"
          )}
          onPress={() => setActiveTab("ONE_ON_ONE")}
        >
          <Typography
            className={cn(
              "text-14",
              activeTab === "ONE_ON_ONE" ? "text-gray-900 font-bold" : "text-gray-400"
            )}
          >
            1:1 문의 내역
          </Typography>
        </TouchableOpacity>
      </View>

      <FlatList
        className="flex-1"
        data={activeTab === "ONE_ON_ONE" ? inquiryPageData?.content : []}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <InquiryListItem inquiry={item} onPressEdit={handlePressEdit} onPressDelete={handlePressDelete} />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-100">
            <Typography className="text-14 text-gray-400">문의 내역이 없습니다.</Typography>
          </View>
        }
      />

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-20"
        style={{ paddingBottom: 10 + inset.bottom }}
      >
        <Button size="xl" variant="primary" onPress={handleWriteInquiry}>
          1:1 문의하기
        </Button>
      </View>
    </View>
  );
}
