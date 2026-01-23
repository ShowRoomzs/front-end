import { TouchableOpacity } from "react-native";

import Header from "@/common/components/Header/Header";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { Category } from "@/features/category/types/category";
import { cn } from "@/common/utils/cn";

interface CategoryDetailHeaderProps {
  subCategory: Category; // 2뎁스 카테고리
  onPressBack: () => void;
  onPressSearch: () => void;
  onPressCart: () => void;
  className?: string;
}
export default function CategoryDetailHeader(props: CategoryDetailHeaderProps) {
  const { subCategory, onPressBack, onPressCart, onPressSearch, className } = props;

  return (
    <Header
      className={cn("px-20", className)}
      renderLeft={
        <HStack className="items-center" gap={8}>
          <TouchableOpacity onPress={onPressBack}>
            <Icon icon={COMMON_ASSETS.back} />
          </TouchableOpacity>
          <Typography className="text-black text-14 font-semibold">{subCategory.name}</Typography>
        </HStack>
      }
      renderRight={
        <HStack className="items-center" gap={16}>
          <TouchableOpacity onPress={onPressSearch} activeOpacity={0.5}>
            <Icon icon={COMMON_ASSETS.search} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressCart} activeOpacity={0.5}>
            <Icon icon={COMMON_ASSETS.cart} />
          </TouchableOpacity>
        </HStack>
      }
    />
  );
}
