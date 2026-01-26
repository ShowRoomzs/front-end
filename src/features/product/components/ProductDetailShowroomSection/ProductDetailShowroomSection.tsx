import { Pressable, View } from "react-native";

import Button from "@/common/components/Button/Button";
import Typography from "@/common/components/Typography/Typography";

export default function ProductDetailShowroomSection() {
  return (
    <View className="flex flex-row items-center justify-between px-20 py-8 flex-1 border-b-[1px] border-t-[1px] border-gray2">
      <Pressable>
        <Typography className="text-14 text-black font-normal">쇼룸명</Typography>
      </Pressable>
      <Button size="xs" className="px-10 py-6" variant="primary">
        <Typography className="text-12 text-white font-normal">방문하기</Typography>
      </Button>
    </View>
  );
}
