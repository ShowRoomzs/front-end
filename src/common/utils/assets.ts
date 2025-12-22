import { FC } from "react";
import { SvgProps } from "react-native-svg";

import AppleIcon from "@/common/assets/common/apple-icon.svg";
import CategoryActiveIcon from "@/common/assets/common/category-active.svg";
import CategoryDefaultIcon from "@/common/assets/common/category-default.svg";
import FollowingActiveIcon from "@/common/assets/common/following-active.svg";
import FollowingDefaultIcon from "@/common/assets/common/following-default.svg";
import GoogleIcon from "@/common/assets/common/google-icon.svg";
import HomeActiveIcon from "@/common/assets/common/home-active.svg";
import HomeDefaultIcon from "@/common/assets/common/home-default.svg";
import LikeActiveIcon from "@/common/assets/common/like-active.svg";
import LikeDefaultIcon from "@/common/assets/common/like-default.svg";
import LogoIcon from "@/common/assets/common/logo.svg";
import MypageActiveIcon from "@/common/assets/common/mypage-active.svg";
import MypageDefaultIcon from "@/common/assets/common/mypage-default.svg";
import NaverIcon from "@/common/assets/common/naver-icon.svg";
import TooltipArrowIcon from "@/common/assets/common/tooltip-arrow.svg";

export interface Asset {
  default: FC<SvgProps>;
  active?: FC<SvgProps>;
  // TODO : add more asset types
}
export interface Assets {
  [key: string]: Asset;
}
export type IconVariant = "default" | "active";

export const COMMON_ASSETS: Assets = {
  category: {
    default: CategoryDefaultIcon,
    active: CategoryActiveIcon,
  },
  following: {
    default: FollowingDefaultIcon,
    active: FollowingActiveIcon,
  },
  like: {
    default: LikeDefaultIcon,
    active: LikeActiveIcon,
  },
  mypage: {
    default: MypageDefaultIcon,
    active: MypageActiveIcon,
  },
  home: {
    default: HomeDefaultIcon,
    active: HomeActiveIcon,
  },

  tooltipArrow: {
    default: TooltipArrowIcon,
  },
  logo: {
    default: LogoIcon,
  },
  naver: {
    default: NaverIcon,
  },
  google: {
    default: GoogleIcon,
  },
  apple: {
    default: AppleIcon,
  },
};
