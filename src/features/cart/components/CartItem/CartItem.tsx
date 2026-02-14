import { useCallback, useMemo } from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";

import Button from "@/common/components/Button/Button";
import Checkbox from "@/common/components/Checkbox/Checkbox";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { COMMON_ASSETS } from "@/common/utils/assets";
import CartOptionBottomSheet from "@/features/cart/components/CartOptionBottomSheet/CartOptionBottomSheet";
import { CartItem as CartItemType } from "@/features/cart/types/cart";
import { extractOption } from "@/features/cart/utils/extractOption";
import { PRODUCT_OPTION_BOTTOM_SHEET_PROPS } from "@/features/product/constants/optionBottomSheet";

interface CartItemProps {
  item: CartItemType;
  isChecked: boolean;
  onPressCheckbox: (cartId: number) => void;
  onChangeOption: (cartId: number, newVariantId: number, newQuantity: number, sheetApi?: SheetApi) => void;
  onPressCoupon: () => void;
  onPressDelete: (cartId: number) => void;
  onPressImage: (cartItem: CartItemType) => void;
}
export default function CartItem(props: CartItemProps) {
  const { item, isChecked, onPressCheckbox, onChangeOption, onPressCoupon, onPressDelete, onPressImage } =
    props;

  const handleConfirmOption = useCallback(
    (cartId: number, newVariantId: number, newQuantity: number, sheetApi?: SheetApi) => {
      onChangeOption(cartId, newVariantId, newQuantity, sheetApi);
    },
    [onChangeOption]
  );

  const { open } = useBottomSheet({
    id: `card-option-bottom-sheet-${item.cartId}`,
    sheetProps: PRODUCT_OPTION_BOTTOM_SHEET_PROPS,
    render: (
      <CartOptionBottomSheet
        cartId={item.cartId}
        productId={item.productId}
        variantId={item.variantId}
        quantity={item.quantity}
        onConfirm={handleConfirmOption}
      />
    ),
  });

  const optionLabel = useMemo(() => {
    return extractOption(item.optionName)
      .map(item => item.optionValue)
      .join(", ");
  }, [item.optionName]);

  return (
    <VStack className="px-20 py-15 border-b-[1px] border-gray2" gap={15}>
      <View className="flex flex-row justify-between items-center">
        <Checkbox isChecked={isChecked} onChange={() => onPressCheckbox(item.cartId)} />
        <TouchableOpacity onPress={() => onPressDelete(item.cartId)} activeOpacity={0.7}>
          <Icon icon={COMMON_ASSETS.closeBlack} />
        </TouchableOpacity>
      </View>

      <HStack gap={15}>
        <Pressable onPress={() => onPressImage(item)}>
          <Image source={{ uri: item.thumbnailUrl }} className="w-80 h-80" />
        </Pressable>
        <View className="flex flex-col flex-1">
          <Typography className="text-12 text-gray10 font-normal">{item.marketName}</Typography>
          <Typography className="text-16 text-black font-medium mt-5">{item.productName}</Typography>
          <Typography className="text-12 text-gray10 font-normal mt-10">{`${optionLabel} / ${item.quantity}개`}</Typography>
          <View className="flex flex-row items-center justify-between mt-10">
            <Typography className="text-12 text-gray9 font-normal line-through">
              {`₩ ${item.price.regularPrice.toLocaleString()}`}
            </Typography>
            <Typography className="text-14 text-black font-semibold">
              {`₩ ${(item.price.maxBenefitPrice * item.quantity).toLocaleString()}`}
            </Typography>
          </View>
        </View>
      </HStack>

      <HStack gap={10}>
        <Button onPress={open} size="md" className="flex-1" variant="secondary-black">
          옵션 변경
        </Button>
        <Button onPress={onPressCoupon} size="md" className="flex-1" variant="secondary-black">
          쿠폰 사용
        </Button>
      </HStack>
    </VStack>
  );
}
