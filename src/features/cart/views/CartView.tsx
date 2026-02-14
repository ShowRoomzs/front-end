import { StackActions } from "@react-navigation/native";
import { AxiosError } from "axios";
import { useCallback } from "react";
import { View } from "react-native";

import { useBottomTab } from "@/common/hooks/useBottomTab";
import { SheetApi } from "@/common/providers/BottomSheetProvider/context";
import { CheckboxProvider } from "@/common/providers/CheckboxProvider";
import { toast } from "@/common/providers/ToastProvider";
import { HOME_ROUTES, useMainNavigation } from "@/common/router";
import { CustomErrorResponse } from "@/common/types/error";
import CartContent from "@/features/cart/components/CartContent/CartContent";
import CartHeader from "@/features/cart/components/CartHeader/CartHeader";
import { useCart } from "@/features/cart/hooks/useCart";

export default function CartView() {
  const navigation = useMainNavigation();
  const { navigate } = useBottomTab();
  const { data: cartItems, update, remove, removeMany } = useCart();
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
    async (cartId: number, newVariantId: number, newQuantity: number, sheetApi?: SheetApi) => {
      try {
        await update(cartId, { variantId: newVariantId, quantity: newQuantity });
        toast.show("옵션이 변경되었습니다.");
        sheetApi?.close();
      } catch (error) {
        const axiosError = error as AxiosError<CustomErrorResponse<string, { message?: string }>>;

        toast.show(axiosError.response?.data?.message || "옵션 변경에 실패했습니다.");
      }
    },
    [update]
  );

  const handlePressDelete = useCallback(
    async (cartId: number) => {
      try {
        await remove(cartId);
        toast.show("삭제되었습니다.");
      } catch (error) {
        const axiosError = error as AxiosError<CustomErrorResponse<string, { message?: string }>>;

        toast.show(axiosError.response?.data?.message || "삭제에 실패했습니다.");
      }
    },
    [remove]
  );

  const handlePressDeleteSelected = useCallback(
    async (cartIds: Array<number>) => {
      try {
        await removeMany(cartIds);
        toast.show("삭제되었습니다.");
      } catch (error) {
        const axiosError = error as AxiosError<CustomErrorResponse<string, { message?: string }>>;

        toast.show(axiosError.response?.data?.message || "삭제에 실패했습니다.");
      }
    },
    [removeMany]
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
          onRemove={handlePressDelete}
          onRemoveMany={handlePressDeleteSelected}
          onChangeOption={handleChangeOption}
          cartItems={cartItems}
          onChangeCheckedItems={handleChangeCheckedItems}
        />
      </CheckboxProvider>
    </View>
  );
}
