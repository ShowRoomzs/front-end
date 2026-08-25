import { useCallback } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyPinIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useModal } from "@/common/providers/ModalProvider";
import { toast } from "@/common/providers/ToastProvider";
import { useMypageNavigation } from "@/common/router";
import { MYPAGE_ROUTES } from "@/common/router/routes";
import AddressRow from "@/features/mypage/components/AddressRow/AddressRow";
import { useAddressMutation } from "@/features/mypage/hooks/useAddressMutation/useAddressMutation";
import { useGetAddressList } from "@/features/mypage/hooks/useGetAddressList";
import { Address } from "@/features/mypage/types/address";

/**
 * C13 배송지 관리.
 *
 * 삭제는 **확인 모달을 거친다** — 되돌릴 수 없고, [수정] 바로 옆에 있어 잘못 누르기 쉽다.
 * 모달 문구에 받는 분과 주소를 넣어 **어느 것을 지우는지** 명시한다. 목록에서 두 배송지가
 * 비슷해 보일 때 "정말 삭제할까요?"만으로는 확인이 되지 않는다.
 *
 * 버튼 배치는 데이터 항목을 지우는 모달 규칙을 따른다 — 모달을 연 목적(삭제)이 로즈·우측,
 * [취소]가 중립 외곽선·좌측.
 */
export default function AddressManagementView() {
  const navigation = useMypageNavigation();
  const { bottom } = useSafeAreaInsets();
  const { show: showModal } = useModal();
  const { data: addressList, isLoading } = useGetAddressList();
  const { defaultAddressMutation, deleteAddressMutation } = useAddressMutation();

  const handlePressAdd = useCallback(() => {
    navigation.navigate(MYPAGE_ROUTES.ADDRESS_FORM, {});
  }, [navigation]);

  const handlePressEdit = useCallback(
    (address: Address) => {
      navigation.navigate(MYPAGE_ROUTES.ADDRESS_FORM, { addressId: address.id });
    },
    [navigation]
  );

  const handlePressSetDefault = useCallback(
    async (address: Address) => {
      try {
        await defaultAddressMutation.mutateAsync(address.id);
      } catch {
        toast.show("기본 배송지를 변경하지 못했어요");
      }
    },
    [defaultAddressMutation]
  );

  const handlePressDelete = useCallback(
    (address: Address) => {
      showModal({
        title: "배송지를 삭제할까요?",
        message: `${address.recipientName} · ${address.address}\n삭제하면 되돌릴 수 없어요`,
        buttons: [
          { label: "취소", variant: "outline" },
          {
            label: "삭제하기",
            onPress: async () => {
              try {
                await deleteAddressMutation.mutateAsync(address.id);
                toast.show("배송지가 삭제되었습니다");
              } catch {
                toast.show("배송지를 삭제하지 못했어요");
              }
            },
          },
        ],
      });
    },
    [deleteAddressMutation, showModal]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Address; index: number }) => (
      <AddressRow
        address={item}
        isFirst={index === 0}
        onPressSetDefault={handlePressSetDefault}
        onPressEdit={handlePressEdit}
        onPressDelete={handlePressDelete}
      />
    ),
    [handlePressDelete, handlePressEdit, handlePressSetDefault]
  );

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="배송지 관리" onPressBack={navigation.goBack} />

      <FlatList
        data={addressList}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View className="h-26" />}
        ListEmptyComponent={
          /* 로딩 중에는 빈 상태를 띄우지 않는다 — "없어요"가 잠깐 떴다 사라지면 오해가 남는다 */
          isLoading ? (
            <View className="pt-120 items-center">
              <Spinner />
            </View>
          ) : (
            <EmptyState
              icon={<EmptyPinIcon size={50} />}
              title="저장된 배송지가 없어요"
              description={"배송지를 미리 등록해 두면\n주문할 때 주소를 다시 쓰지 않아도 돼요"}
              paddingTop={120}
            />
          )
        }
      />

      <View
        className="border-t-[0.5px] border-divider bg-white px-14 pt-12"
        style={{ paddingBottom: bottom + 26 }}
      >
        <TouchableOpacity
          onPress={handlePressAdd}
          activeOpacity={0.75}
          className="h-52 flex-row items-center justify-center rounded-base bg-rose"
        >
          <Typography variant="buttonPrimary" className="text-white">
            배송지 추가
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}
