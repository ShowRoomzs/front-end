import { StackActions } from "@react-navigation/native";
import { useCallback } from "react";
import { View } from "react-native";

import { useBottomTab } from "@/common/hooks/useBottomTab";
import { CheckboxProvider } from "@/common/providers/CheckboxProvider";
import { toast } from "@/common/providers/ToastProvider";
import { HOME_ROUTES, useMainNavigation } from "@/common/router";
import CartContent from "@/features/cart/components/CartContent/CartContent";
import CartHeader from "@/features/cart/components/CartHeader/CartHeader";
import { useCart } from "@/features/cart/hooks/useCart";

export default function CartView() {
  const navigation = useMainNavigation();
  const { navigate } = useBottomTab();
  const { data: cartItems, update } = useCart();
  const handlePressBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePressHome = useCallback(() => {
    // 현재 스택 초기화
    navigation.dispatch(StackActions.popToTop());
    // home tab navigator > home 으로 라우팅
    navigate(HOME_ROUTES.HOME);
  }, [navigate, navigation]);

  const handleChangeCheckedItems = useCallback((newCheckedItems: Set<string>) => {
    console.log(newCheckedItems);
  }, []);

  const handleChangeOption = useCallback(
    async (cartId: number, newVariantId: number, newQuantity: number) => {
      try {
        await update(cartId, { variantId: newVariantId, quantity: newQuantity });
        toast.show("옵션이 변경되었습니다.");
      } catch (error) {
        console.error(error);
      }
    },
    [update]
  );

  return (
    <View className="flex-1">
      <CartHeader
        wrapperClassName="px-20 border-b-[1px] border-gray2 py-10"
        onPressBack={handlePressBack}
        onPressHome={handlePressHome}
      />
      <CheckboxProvider>
        <CartContent
          onChangeOption={handleChangeOption}
          cartItems={cartItems}
          onChangeCheckedItems={handleChangeCheckedItems}
        />
      </CheckboxProvider>
    </View>
  );
}
