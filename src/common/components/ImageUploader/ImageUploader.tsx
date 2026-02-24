import { Image, ScrollView, TouchableOpacity, View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";

// TODO: 리뷰 작성 페이지에서 props 타입 재사용이 필요해지면 export interface로 변경
interface ImageUploaderProps {
  imageUrls: Array<string>;
  maxCount?: number;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

export default function ImageUploader(props: ImageUploaderProps) {
  const { imageUrls, maxCount = 10, onAddImage, onRemoveImage } = props;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row items-center gap-10">
        <TouchableOpacity
          onPress={onAddImage}
          activeOpacity={0.7}
          className="w-[120px] h-[150px] rounded-[5px] border border-gray2 bg-white items-center justify-center"
        >
          <Icon icon={COMMON_ASSETS.plusIcon} width={24} height={24} />
          <Typography className="text-12 text-gray7 mt-8">
            {imageUrls.length}/{maxCount}
          </Typography>
        </TouchableOpacity>

        {imageUrls.map((url, index) => (
          <View
            key={`${url}-${index}`}
            className="w-[120px] h-[150px] rounded-[5px] border border-gray2 overflow-hidden relative"
          >
            <Image source={{ uri: url }} style={{ width: "100%", height: "100%" }} />
            <TouchableOpacity
              onPress={() => onRemoveImage(index)}
              activeOpacity={0.8}
              className="absolute top-8 right-8 w-24 h-24 bg-black/60 rounded-full items-center justify-center"
            >
              <Icon icon={COMMON_ASSETS.closeBlack} width={12} height={12} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
