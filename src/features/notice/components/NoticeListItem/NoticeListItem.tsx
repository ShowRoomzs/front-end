import dayjs from "dayjs";
import { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

import { NoticeListItem as NoticeItemType } from "../../types/notice";

import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";

interface NoticeListItemProps {
  item: NoticeItemType;
  onPress: (id: number) => void;
}

export default function NoticeListItem(props: NoticeListItemProps) {
  const { item, onPress } = props;

  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <View className="w-full px-20 py-16 bg-white">
        <VStack gap={6}>
          <Typography className="font-medium text-black text-15">{item.title}</Typography>
          <Typography className="font-normal text-13 text-gray7">
            {dayjs(item.createdDate).format("YYYY.MM.DD HH:mm")}
          </Typography>
        </VStack>
      </View>
    </TouchableOpacity>
  );
}
