import { View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";
import { Address } from "@/features/mypage/types/address";

interface AddressCardProps {
  address: Address;
  onPressDefaultAddress: (address: Address) => void;
  onPressEdit: (address: Address) => void;
  onPressDelete: (address: Address) => void;
}
export default function AddressCard(props: AddressCardProps) {
  const { address, onPressDefaultAddress, onPressEdit, onPressDelete } = props;

  const isDefault = address.default;

  return (
    <View
      className={cn(
        "overflow-hidden rounded-[8px] border bg-white",
        isDefault ? "border-pointColor border-[1.5px]" : "border-gray2 border-[1px]"
      )}
    >
      <View className="p-20">
        <View className="flex-row items-center justify-between gap-10">
          <Typography className="flex-1 text-16 font-semibold text-black" numberOfLines={1}>
            {address.recipientName}
          </Typography>
          {isDefault && (
            <View className="rounded-full bg-pointColorOpacity10 px-12 py-5">
              <Typography className="text-12 font-medium text-pointColor">기본 배송지</Typography>
            </View>
          )}
        </View>

        <Typography className="mt-12 text-13 text-gray8">{address.phoneNumber}</Typography>
        <Typography className="mt-6 text-14 leading-[20px] text-gray10" numberOfLines={2}>
          {[address.address, address.detailAddress].filter(Boolean).join(" ")}
        </Typography>
      </View>

      <View className="border-t border-gray2 pt-15 p-20">
        {!isDefault && (
          <Button
            onPress={() => onPressDefaultAddress(address)}
            size="sm"
            variant="outline-point"
            className="mb-10 w-full"
          >
            기본 배송지로 지정
          </Button>
        )}
        <HStack gap={10}>
          <Button
            onPress={() => onPressDelete(address)}
            size="md"
            className="flex-1"
            variant="secondary-black"
          >
            삭제
          </Button>
          <Button onPress={() => onPressEdit(address)} size="md" className="flex-1" variant="secondary-black">
            수정
          </Button>
        </HStack>
      </View>
    </View>
  );
}
