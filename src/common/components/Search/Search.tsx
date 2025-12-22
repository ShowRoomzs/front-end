import { View } from "react-native";

import Icon from "../Icon/Icon";

import Input, { InputProps } from "@/common/components/Input/Input";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

interface SearchProps extends InputProps {
  onPressSearch: () => void;
  className?: string;
}

export default function Search(props: SearchProps) {
  const { onPressSearch, className, ...inputProps } = props;

  const getDefaultClassName = () => {
    return "bg-gray0 rounded-[5px] border-[1px] border-gray2 text-black font-[400]";
  };

  const getIconSize = () => {
    switch (inputProps.size) {
      case "small":
        return 10;
      case "medium":
        return 15;
    }
  };

  return (
    <Input
      onPress={onPressSearch}
      wrapperClassName={cn(getDefaultClassName(), className)}
      renderPreFix={
        <View
          style={{ width: getIconSize(), height: getIconSize() }}
          className="flex items-center justify-center"
        >
          <Icon icon={COMMON_ASSETS.search} width={getIconSize()} height={getIconSize()} />
        </View>
      }
      {...inputProps}
    />
  );
}
