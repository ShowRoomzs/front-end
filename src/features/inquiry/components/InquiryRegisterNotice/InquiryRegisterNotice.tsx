import { View } from "react-native";

import Divider from "@/common/components/Divider/Divider";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";

const NOTICE_ITEMS = [
  "특별한 유의사항인 경우 이렇게 표시 됩니다. 그리고 두줄이 될 수 있습니다.",
  "특별한 유의사항인 경우 이렇게 표시 됩니다. 그리고 두줄이 될 수 있습니다.",
];

export default function InquiryRegisterNotice() {
  return (
    <View className="py-30 px-20">
      <LabeledComponent label="유의사항">
        <View className="bg-gray0 border border-gray2 rounded-[5px] p-15">
          <VStack gap={8}>
            <Typography className="text-gray12 text-11 font-normal">{NOTICE_ITEMS[0]}</Typography>
            <Divider wrapperClassName="bg-gray2" />
            <Typography className="text-gray12 text-11 font-normal">{NOTICE_ITEMS[1]}</Typography>
          </VStack>
        </View>
      </LabeledComponent>
    </View>
  );
}
