import { View } from "react-native";

import Divider from "@/common/components/Divider/Divider";
import LabeledComponent from "@/common/components/LabeledComponent/LabeledComponent";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";

const NOTICE_ITEMS = [
  "제품 사용, 오염, 전용 박스 손상, 라벨 제거, 사은품 및 부속 사용/분실 시, 교환/환불이 불가능 합니다.",
  "교환을 원하시는 상품(사이즈)의 재고가 부족 시, 교환이 불가합니다.",
  "고객님의 주문내역을 선택, 질문이 필요한 상품을 선택하시면 1:1상담이 가능합니다.",
  "주문취소/교환/환불은 마이페이지>주문내역에서 신청하실 수 있습니다.",
  "1:1문의 처리 내역은 마이페이지>1:1문의를 통해 확인하실 수 있습니다.",
  "상품 정보(사이즈, 실측, 예상 배송일 등) 관련 문의는 해당 상품 문의에 남기셔야 빠른 답변이 가능합니다.",
];

export default function InquiryRegisterNotice() {
  return (
    <View className="py-30 px-20">
      <LabeledComponent label="유의사항">
        <View className="bg-gray0 border border-gray2 rounded-[5px] p-15">
          <VStack gap={8}>
            {NOTICE_ITEMS.slice(0, 2).map((item, index) => (
              <Typography key={index} className="text-pointColor text-11 font-normal">
                {`- ${item}`}
              </Typography>
            ))}
            <Divider wrapperClassName="bg-gray2" />
            {NOTICE_ITEMS.slice(2).map((item, index) => (
              <Typography key={index} className="text-gray12 text-11 font-normal">
                {`- ${item}`}
              </Typography>
            ))}
          </VStack>
        </View>
      </LabeledComponent>
    </View>
  );
}
