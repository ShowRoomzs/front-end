import { View } from "react-native";

import type { DaumPostcodeData } from "@/common/components/DaumPostcode/DaumPostcode";

import DaumPostcode from "@/common/components/DaumPostcode/DaumPostcode";

interface SearchAddressModalProps {
  onSelect: (data: DaumPostcodeData) => void;
}

export default function SearchAddressModal(props: SearchAddressModalProps) {
  const { onSelect } = props;

  return (
    <View className="flex-1 py-20">
      <DaumPostcode onSubmit={onSelect} />
    </View>
  );
}
