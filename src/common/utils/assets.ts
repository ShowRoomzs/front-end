import { FC } from "react";
import { SvgProps } from "react-native-svg";

import AppleIcon from "@/common/assets/common/apple-icon.svg";
import ArrowDownIcon from "@/common/assets/common/arrow-down.svg";
import ArrowRightIcon from "@/common/assets/common/arrow-right.svg";
import BackIcon from "@/common/assets/common/back.svg";
import CartIcon from "@/common/assets/common/cart.svg";
import CategoryActiveIcon from "@/common/assets/common/category-active.svg";
import CategoryDefaultIcon from "@/common/assets/common/category-default.svg";
import CheckIcon from "@/common/assets/common/check.svg";
import CloseBlackIcon from "@/common/assets/common/close.svg";
import FollowingActiveIcon from "@/common/assets/common/following-active.svg";
import FollowingDefaultIcon from "@/common/assets/common/following-default.svg";
import FollowingIcon from "@/common/assets/common/following.svg";
import GoogleIcon from "@/common/assets/common/google-icon.svg";
import HomeActiveIcon from "@/common/assets/common/home-active.svg";
import HomeDefaultIcon from "@/common/assets/common/home-default.svg";
import KakaoIcon from "@/common/assets/common/kakao-icon.svg";
import LikeActiveIcon from "@/common/assets/common/like-active.svg";
import LikeDefaultIcon from "@/common/assets/common/like-default.svg";
import LogoBlackIcon from "@/common/assets/common/logo-black.svg";
import LogoIcon from "@/common/assets/common/logo.svg";
import MypageActiveIcon from "@/common/assets/common/mypage-active.svg";
import MypageDefaultIcon from "@/common/assets/common/mypage-default.svg";
import NaverIcon from "@/common/assets/common/naver-icon.svg";
import NotificationIcon from "@/common/assets/common/notification.svg";
import ResetIcon from "@/common/assets/common/reset-icon.svg";
import SearchIcon from "@/common/assets/common/search.svg";
import SettingIcon from "@/common/assets/common/setting.svg";
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
  logoBlack: {
    default: LogoBlackIcon,
  },
  naver: {
    default: NaverIcon,
  },
  kakao: {
    default: KakaoIcon,
  },
  google: {
    default: GoogleIcon,
  },
  apple: {
    default: AppleIcon,
  },
  notification: {
    default: NotificationIcon,
  },
  cart: {
    default: CartIcon,
  },
  search: {
    default: SearchIcon,
  },
  back: {
    default: BackIcon,
  },
  check: {
    default: CheckIcon,
  },
  closeBlack: {
    default: CloseBlackIcon,
  },
  setting: {
    default: SettingIcon,
  },
  arrowRight: {
    default: ArrowRightIcon,
  },
  followingIcon: {
    default: FollowingIcon,
  },
  arrowDown: {
    default: ArrowDownIcon,
  },
  reset: {
    default: ResetIcon,
  },
};
