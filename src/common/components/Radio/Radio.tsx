import { Pressable, View } from "react-native";

import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface RadioProps {
  isChecked: boolean;
  onChange: () => void;
  label?: string;
}
export default function Radio(props: RadioProps) {
  const { isChecked, onChange, label } = props;
  const getDefaultClassName = () => {
    return "w-24 h-24 rounded-full flex items-center justify-center";
  };

  const getCheckedContent = () => {
    return (
      <View className={cn(getDefaultClassName(), "bg-gray13 border-[1px] border-gray15")}>
        <View className="bg-white w-10 h-10 rounded-full" />
      </View>
    );
  };

  const getUnCheckedContent = () => {
    return <View className={cn(getDefaultClassName(), "bg-gray1 border-[1px] border-gray3")} />;
  };

  return (
    <Pressable onPress={onChange}>
      <HStack gap={10} className="items-center">
        {isChecked ? getCheckedContent() : getUnCheckedContent()}
        <Typography
          className={cn("text-13", isChecked ? "text-black font-medium" : "text-gray10 font-normal")}
        >
          {label}
        </Typography>
      </HStack>
    </Pressable>
  );
}
