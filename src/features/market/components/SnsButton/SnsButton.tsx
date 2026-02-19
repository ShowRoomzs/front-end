import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Icon from "@/common/components/Icon/Icon";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { SnsLink } from "@/features/market/types/market";

interface SnsButtonProps {
  snsLink: SnsLink;
  onPress: () => void;
}
export default function SnsButton(props: SnsButtonProps) {
  const { snsLink, onPress } = props;

  const getIcon = () => {
    switch (snsLink.snsType) {
      case "INSTAGRAM":
        return <Icon icon={COMMON_ASSETS.instagram} />;
      case "YOUTUBE":
        return <Icon icon={COMMON_ASSETS.youtube} />;
      case "TIKTOK":
        return <Icon icon={COMMON_ASSETS.tiktok} />;
      case "X":
        return <Icon icon={COMMON_ASSETS.x} />;
    }
  };

  return (
    <Button variant="secondary" size="sm" className="px-10">
      <HStack gap={10} className="items-center">
        {getIcon()}
        <Icon icon={COMMON_ASSETS.externalArrow} />
      </HStack>
    </Button>
  );
}
