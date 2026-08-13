import { View } from "react-native";

import Divider from "@/common/components/Divider/Divider";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";

const NOTICE_ITEMS = [
  "상품 관련 문의는 판매자가 상세히 답변드립니다.",
  "답변은 마이페이지 > 1:1문의에서 확인하실 수 있습니다.",
];

const noticeTextClassName = "text-gray12 text-11 font-normal";

export default function ProductInquiryNotice() {
  return (
    <View className="py-30 px-20">
      <LabeledComponent label="유의사항">
        <View className="bg-gray0 border border-gray2 rounded-[5px] p-15">
          <VStack gap={8}>
            <Typography className={noticeTextClassName}>{NOTICE_ITEMS[0]}</Typography>
            <Divider wrapperClassName="bg-gray2" />
            <Typography className={noticeTextClassName}>{NOTICE_ITEMS[1]}</Typography>
          </VStack>
        </View>
      </LabeledComponent>
    </View>
  );
}
