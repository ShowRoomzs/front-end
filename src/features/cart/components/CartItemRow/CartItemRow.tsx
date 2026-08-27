import { Image, TouchableOpacity, View } from "react-native";

import Checkbox from "@/common/components/Checkbox/Checkbox";
import { CloseIcon } from "@/common/components/DsIcon/icons";
import Stepper from "@/common/components/Stepper/Stepper";
import Typography from "@/common/components/Typography/Typography";
import { formatPrice } from "@/common/utils/formatPrice";
import { CartItem } from "@/features/cart/types/cart";

/**
 * 장바구니 한 행.
 *
 * 담은 뒤 마감·품절된 항목은 목록에서 지우지 않는다 — 담아 둔 것은 기억이자 의도라, 말없이
 * 사라지면 "내가 담았던 게 뭐였지"가 되고 합계가 줄어든 이유도 알 수 없다. 대신 선택에서 빼고
 * 삭제는 사용자가 결정한다.
 *
 * 못 사는 상품에는 조작 컨트롤을 남기지 않는다 — 수량 스테퍼와 가격 자리에 사유 문구만 들어가고,
 * 옵션 [변경] 링크도 사라진다. 삭제는 행 우측 상단의 X가 이미 담당하므로 버튼을 따로 두지 않는다.
 */
interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: (cartId: number) => void;
  onChangeQuantity: (cartId: number, quantity: number) => void;
  onPressChangeOption: (item: CartItem) => void;
  onPressRemove: (cartId: number) => void;
}

const THUMBNAIL_SIZE = 74;

export default function CartItemRow(props: CartItemRowProps) {
  const { item, isSelected, onToggleSelect, onChangeQuantity, onPressChangeOption, onPressRemove } = props;
  const { availability } = item;
  const isUnavailable = !availability.isPurchasable;

  return (
    <View className="flex-row px-14 py-12" style={{ gap: 10 }}>
      <View className="pt-2">
        {/* 살 수 없는 항목은 체크를 지우지 않고 회색으로 낮춘다 — 자리가 사라지면 왜 못 고르는지 모른다 */}
        <Checkbox
          isChecked={isSelected && !isUnavailable}
          disabled={isUnavailable}
          onChange={() => onToggleSelect(item.cartId)}
        />
      </View>

      <View className="relative" style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}>
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE, borderRadius: 4 }}
          resizeMode="cover"
        />
        {isUnavailable && (
          <>
            {/* 탈색만으로는 여전히 선명해 판매중 상품과 구분되지 않는다 — 흰 베일을 겹친다 */}
            <View
              className="absolute inset-0 rounded-thumbnail bg-white"
              style={{ opacity: 0.55 }}
              pointerEvents="none"
            />
            {!!availability.label && (
              <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
                <Typography
                  style={{ fontSize: 12, fontWeight: "600", lineHeight: 12 }}
                  className="text-gray62"
                >
                  {availability.label}
                </Typography>
              </View>
            )}
          </>
        )}
      </View>

      <View className="min-w-0 flex-1">
        <View className="flex-row items-start" style={{ gap: 8 }}>
          <Typography
            variant="productName"
            className={`min-w-0 flex-1 ${isUnavailable ? "text-gray62" : "text-ink80"}`}
            numberOfLines={1}
          >
            {item.productName}
          </Typography>
          <TouchableOpacity
            onPress={() => onPressRemove(item.cartId)}
            activeOpacity={0.5}
            style={{ padding: 6, margin: -6 }}
          >
            <CloseIcon size={14} />
          </TouchableOpacity>
        </View>

        <View className="mt-4 flex-row items-center" style={{ gap: 6 }}>
          <Typography
            style={{ fontSize: 12, lineHeight: 18 }}
            className={`min-w-0 shrink ${isUnavailable ? "text-chevron" : "text-gray45"}`}
            numberOfLines={1}
          >
            {item.optionName}
          </Typography>
          {!isUnavailable && (
            <TouchableOpacity
              onPress={() => onPressChangeOption(item)}
              activeOpacity={0.5}
              style={{ paddingVertical: 6, marginVertical: -6 }}
            >
              <Typography
                style={{ fontSize: 12, fontWeight: "600", lineHeight: 18, textDecorationLine: "underline" }}
                className="text-ink76"
              >
                변경
              </Typography>
            </TouchableOpacity>
          )}
        </View>

        {isUnavailable ? (
          <Typography
            style={{ fontSize: 12, fontWeight: "600", lineHeight: 18, marginTop: 8 }}
            className="text-gray62"
          >
            {availability.message}
          </Typography>
        ) : (
          <View className="mt-8 flex-row items-end justify-between">
            <Stepper
              value={item.quantity}
              min={1}
              max={item.stock.stock || undefined}
              onChange={quantity => onChangeQuantity(item.cartId, quantity)}
            />
            <View className="items-end">
              {item.price.regularPrice > item.price.salePrice && (
                <Typography
                  style={{ fontSize: 12, lineHeight: 12, textDecorationLine: "line-through" }}
                  className="text-gray71"
                >
                  {formatPrice(item.price.regularPrice * item.quantity)}
                </Typography>
              )}
              <Typography variant="price" className="mt-4 text-ink">
                {formatPrice(item.price.salePrice * item.quantity)}원
              </Typography>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
