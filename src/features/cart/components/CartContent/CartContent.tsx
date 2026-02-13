import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/common/components/Button/Button";
import { useCheckbox } from "@/common/hooks/useCheckbox";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import CartAllSelectSection from "@/features/cart/components/CartAllSelectSection/CartAllSelectSection";
import CartItemComponent from "@/features/cart/components/CartItem/CartItem";
import CartPaymentSummary from "@/features/cart/components/CartPaymentSummary/CartPaymentSummary";
import { CartItem } from "@/features/cart/types/cart";

interface CartContentProps {
  cartItems: Array<CartItem>;
  onChangeCheckedItems: (newCheckedItems: Set<string>) => void;
  onChangeOption: (cartId: number, newVariantId: number, newQuantity: number, sheetApi?: SheetApi) => void;
}
export default function CartContent(props: CartContentProps) {
  const { cartItems, onChangeCheckedItems, onChangeOption } = props;
  const inset = useSafeAreaInsets();
  const { checkedItems, isAllChecked, toggleAll, toggleItem } = useCheckbox();
  const [actionButtonHeight, setActionButtonHeight] = useState(0);
  const allIds = useMemo(() => cartItems.map(item => String(item.cartId)), [cartItems]);
  const isMounted = useRef(false);

  useEffect(() => {
    if (allIds.length === 0 || isMounted.current) {
      return;
    }
    isMounted.current = true;
    toggleAll(allIds);
  }, [allIds, toggleAll]);

  useEffect(() => {
    onChangeCheckedItems(checkedItems);
  }, [checkedItems, onChangeCheckedItems]);

  const handlePressAllCheck = useCallback(() => {
    toggleAll(allIds);
  }, [toggleAll, allIds]);

  const handlePressDeleteSelected = useCallback(() => {
    console.log("asdf");
  }, []);

  const handlePressDelete = useCallback((cartId: number) => {
    console.log("asdf");
  }, []);

  const handleChangeOption = useCallback(
    (cartId: number, newVariantId: number, newQuantity: number, sheetApi?: SheetApi) => {
      onChangeOption(cartId, newVariantId, newQuantity, sheetApi);
    },
    [onChangeOption]
  );

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => {
      return (
        <CartItemComponent
          item={item}
          isChecked={checkedItems.has(String(item.cartId))}
          onPressCheckbox={(cartId: number) => toggleItem(String(cartId))}
          onChangeOption={handleChangeOption}
          onPressCoupon={() => {}}
          onPressDelete={handlePressDelete}
          onPress={() => {}}
        />
      );
    },
    [checkedItems, handleChangeOption, handlePressDelete, toggleItem]
  );

  const totalDeliveryFee = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.deliveryFee, 0),
    [cartItems]
  );

  const adjustmentItems = useMemo(
    () => [
      {
        label: "쿠폰 할인비",
        value: -3000,
      },
      {
        label: "배송비",
        value: totalDeliveryFee,
      },
    ],
    [totalDeliveryFee]
  );

  const checkedCartItems = useMemo(
    () => cartItems.filter(item => checkedItems.has(String(item.cartId))),
    [cartItems, checkedItems]
  );

  const totalPrice = useMemo(() => {
    return checkedCartItems.reduce((sum, item) => sum + item.price.maxBenefitPrice * item.quantity, 0);
  }, [checkedCartItems]);

  return (
    <View className="flex-1">
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <CartAllSelectSection
            onPressDeleteSelected={handlePressDeleteSelected}
            onPressAllCheck={handlePressAllCheck}
            isCheckedAll={isAllChecked(allIds)}
          />
        }
        ListFooterComponent={
          cartItems.length > 0 ? (
            <CartPaymentSummary totalPrice={totalPrice} priceAdjustments={adjustmentItems} />
          ) : null
        }
        style={{ marginBottom: actionButtonHeight }}
      />
      <View
        onLayout={e => setActionButtonHeight(e.nativeEvent.layout.height)}
        style={{ paddingBottom: inset.bottom + 10 }}
        className="absolute bottom-0 left-0 right-0 bg-white p-10 border-t-[1px] border-gray2"
      >
        <Button disabled={checkedItems.size === 0} className="flex-1" size="xl" variant="primary">
          {`${totalPrice > 0 ? `${totalPrice.toLocaleString()} ` : ""}구매하기`}
        </Button>
      </View>
    </View>
  );
}
