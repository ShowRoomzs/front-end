import { FC } from "react";
import { SvgProps } from "react-native-svg";

import CategoryActiveIcon from "@/common/assets/common/category-active.svg";
import CategoryDefaultIcon from "@/common/assets/common/category-default.svg";
import FeedActiveIcon from "@/common/assets/common/feed-active.svg";
import FeedDefaultIcon from "@/common/assets/common/feed-default.svg";
import HomeActiveIcon from "@/common/assets/common/home-active.svg";
import HomeDefaultIcon from "@/common/assets/common/home-default.svg";
import ProfileActiveIcon from "@/common/assets/common/profile-active.svg";
import ProfileDefaultIcon from "@/common/assets/common/profile-default.svg";
import WishListActiveIcon from "@/common/assets/common/wish-active.svg";
import WishListDefaultIcon from "@/common/assets/common/wish-default.svg";

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
  feed: {
    default: FeedDefaultIcon,
    active: FeedActiveIcon,
  },
  wishList: {
    default: WishListDefaultIcon,
    active: WishListActiveIcon,
  },
  home: {
    default: HomeDefaultIcon,
    active: HomeActiveIcon,
  },
  profile: {
    default: ProfileDefaultIcon,
    active: ProfileActiveIcon,
  },
};
