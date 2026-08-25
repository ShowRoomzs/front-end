import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";

/**
 * 사진 첨부 — 72px 정사각 · 가로 스크롤 (C12 · C7-1).
 *
 * 최대 매수를 채우면 추가 칸을 **없애지 않고 회색 비활성으로 바꾼다**. 자리가 사라지면
 * 사용자는 자기가 잘못 눌렀는지 왜 못 넣는지 알 수 없다 — 칸은 남기고 그 아래 한도를 적는다.
 *
 * 삭제 X는 썸네일 밖으로 5px 튀어나오므로, 스크롤 컨테이너에 위·오른쪽 여백 5를 준다.
 */
interface ImageUploaderProps {
  imageUrls: Array<string>;
  maxCount?: number;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

const TILE_SIZE = 72;
const BADGE_OFFSET = 5;

export default function ImageUploader(props: ImageUploaderProps) {
  const { imageUrls, maxCount = 5, onAddImage, onRemoveImage } = props;
  const isFull = imageUrls.length >= maxCount;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingTop: BADGE_OFFSET, paddingRight: BADGE_OFFSET }}
      >
        <TouchableOpacity
          onPress={onAddImage}
          disabled={isFull}
          activeOpacity={0.6}
          className="items-center justify-center rounded-base"
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            gap: 4,
            ...(isFull
              ? { backgroundColor: "#F4F4F5" }
              : { borderWidth: 1, borderStyle: "dashed", borderColor: "#DCDCDE" }),
          }}
        >
          <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 6.5v11"
              stroke={isFull ? "#B5B5B5" : "#8E8E8E"}
              strokeWidth={1.7}
              strokeLinecap="round"
            />
            <Path
              d="M6.5 12h11"
              stroke={isFull ? "#B5B5B5" : "#8E8E8E"}
              strokeWidth={1.7}
              strokeLinecap="round"
            />
          </Svg>
          <Typography
            style={{ fontSize: 10.5, lineHeight: 10.5 }}
            className={isFull ? "text-gray71" : "text-gray55"}
          >
            {imageUrls.length}/{maxCount}
          </Typography>
        </TouchableOpacity>

        {imageUrls.map((url, index) => (
          <View key={`${url}-${index}`} style={{ width: TILE_SIZE, height: TILE_SIZE }}>
            <Image source={{ uri: url }} className="h-full w-full rounded-base" />

            <TouchableOpacity
              onPress={() => onRemoveImage(index)}
              activeOpacity={0.7}
              className="absolute items-center justify-center rounded-full bg-ink"
              style={{
                top: -BADGE_OFFSET,
                right: -BADGE_OFFSET,
                width: 20,
                height: 20,
                borderWidth: 1.5,
                borderColor: "#FFFFFF",
              }}
            >
              <Svg width={9} height={9} viewBox="0 0 24 24" fill="none">
                <Path d="M6 6l12 12" stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" />
                <Path d="M18 6L6 18" stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {isFull && (
        <Typography style={{ fontSize: 11.5, lineHeight: 18.4, marginTop: 9 }} className="text-gray45">
          사진은 최대 {maxCount}장까지 첨부할 수 있어요
        </Typography>
      )}
    </View>
  );
}
