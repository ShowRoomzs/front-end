import { useCallback, useEffect, useMemo } from "react";
import { FlatList } from "react-native";

import { useCheckbox } from "@/common/hooks/useCheckbox";
import CartAllSelectSection from "@/features/cart/components/CartAllSelectSection/CartAllSelectSection";
import CartItemComponent from "@/features/cart/components/CartItem/CartItem";
import CartPaymentSummary from "@/features/cart/components/CartPaymentSummary/CartPaymentSummary";
import { CartItem } from "@/features/cart/types/cart";

interface CartContentProps {
  cartItems: Array<CartItem>;
  onChangeCheckedItems: (newCheckedItems: Set<string>) => void;
  onChangeOption: (cartId: number, newVariantId: number, newQuantity: number) => void;
}
export default function CartContent(props: CartContentProps) {
  const { cartItems, onChangeCheckedItems, onChangeOption } = props;

  const { checkedItems, isAllChecked, toggleAll, toggleItem } = useCheckbox();
  const allIds = useMemo(() => cartItems.map(item => String(item.cartId)), [cartItems]);

  useEffect(() => {
    onChangeCheckedItems(checkedItems);
  }, [checkedItems, onChangeCheckedItems]);

  const handlePressAllCheck = useCallback(() => {
    toggleAll(allIds);
  }, [toggleAll, allIds]);

  const handlePressDeleteSelected = useCallback(() => {
    console.log("asdf");
  }, []);

  const handleChangeOption = useCallback(
    (cartId: number, newVariantId: number, newQuantity: number) => {
      onChangeOption(cartId, newVariantId, newQuantity);
    },
    [onChangeOption]
  );

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => {
      return (
        <CartItemComponent
          item={item}
          isChecked={checkedItems.has(String(item.cartId))}
          onPressCheckbox={() => toggleItem(String(item.cartId))}
          onChangeOption={handleChangeOption}
          onPressCoupon={() => {}}
          onPressDelete={() => {}}
          onPress={() => {}}
        />
      );
    },
    [checkedItems, handleChangeOption, toggleItem]
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

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price.maxBenefitPrice * item.quantity, 0),
    [cartItems]
  );

  return (
    <FlatList
      data={cartItems}
      renderItem={renderItem}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
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
    />
  );
}
