import { FC } from "react";
import { SvgProps } from "react-native-svg";

import AnswerIcon from "@/common/assets/common/answer.svg";
import AppleIcon from "@/common/assets/common/apple-icon.svg";
import ArrowDownIcon from "@/common/assets/common/arrow-down.svg";
import ArrowRightIcon from "@/common/assets/common/arrow-right.svg";
import BackIcon from "@/common/assets/common/back.svg";
import CartIcon from "@/common/assets/common/cart.svg";
import CategoryActiveIcon from "@/common/assets/common/category-active.svg";
import CategoryDefaultIcon from "@/common/assets/common/category-default.svg";
import CheckBlackIcon from "@/common/assets/common/check-black.svg";
import CheckIcon from "@/common/assets/common/check.svg";
import CloseGrayIcon from "@/common/assets/common/close-gray-icon.svg";
import CloseBlackIcon from "@/common/assets/common/close.svg";
import CommentIcon from "@/common/assets/common/comment-icon.svg";
import DownloadIcon from "@/common/assets/common/download-icon.svg";
import EmptyIcon from "@/common/assets/common/empty.svg";
import ExternalArrowIcon from "@/common/assets/common/external-arrow.svg";
import FollowingActiveIcon from "@/common/assets/common/following-active.svg";
import FollowingDefaultIcon from "@/common/assets/common/following-default.svg";
import FollowingGrayIcon from "@/common/assets/common/following-gray.svg";
import FollowingIcon from "@/common/assets/common/following.svg";
import GiftIcon from "@/common/assets/common/gift.svg";
import GoogleIcon from "@/common/assets/common/google-icon.svg";
import HomeActiveIcon from "@/common/assets/common/home-active.svg";
import HomeBlackIcon from "@/common/assets/common/home-black.svg";
import HomeDefaultIcon from "@/common/assets/common/home-default.svg";
import InfoIcon from "@/common/assets/common/info-icon.svg";
import InstagramIcon from "@/common/assets/common/instagram-black.svg";
import InstagramGlyphIcon from "@/common/assets/common/instagram-glyph.svg";
import KakaoIcon from "@/common/assets/common/kakao-icon.svg";
import LikeActiveIcon from "@/common/assets/common/like-active.svg";
import LikeBigFilledIcon from "@/common/assets/common/like-big-filled-icon.svg";
import LikeBigIcon from "@/common/assets/common/like-big-icon.svg";
import LikeBigOutlineIcon from "@/common/assets/common/like-big-outline-icon.svg";
import LikeDefaultIcon from "@/common/assets/common/like-default.svg";
import LikeIcon from "@/common/assets/common/like-icon.svg";
import LogoBlackIcon from "@/common/assets/common/logo-black.svg";
import LogoIcon from "@/common/assets/common/logo.svg";
import MinusIcon from "@/common/assets/common/minus-icon.svg";
import MypageActiveIcon from "@/common/assets/common/mypage-active.svg";
import MypageDefaultIcon from "@/common/assets/common/mypage-default.svg";
import NaverIcon from "@/common/assets/common/naver-icon.svg";
import NotificationIcon from "@/common/assets/common/notification.svg";
import PlusIconPoint from "@/common/assets/common/plus-icon-point.svg";
import PlusIcon from "@/common/assets/common/plus-icon.svg";
import QuestionIcon from "@/common/assets/common/question.svg";
import ResetIcon from "@/common/assets/common/reset-icon.svg";
import SearchIcon from "@/common/assets/common/search.svg";
import SettingIcon from "@/common/assets/common/setting.svg";
import WordmarkColorIcon from "@/common/assets/common/showroomz-wordmark-color.svg";
import WordmarkDarkIcon from "@/common/assets/common/showroomz-wordmark-dark.svg";
import TooltipArrowIcon from "@/common/assets/common/tooltip-arrow.svg";
import YoutubeIcon from "@/common/assets/common/youtube-black.svg";

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
  wishlist: {
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
  /**
   * 디자인 확정 워드마크. color는 로즈(#F2456E), dark는 잉크(#1A1B1F)이며 글자 형태는 같다.
   * 밝은 배경에는 color, 어두운 배경에는 dark를 쓴다. 본문 서체(Pretendard)로 대체하지 않는다 —
   * 워드마크는 Fredoka 기반이라 UI 폰트로 흉내 내면 자간·굵기가 달라진다.
   */
  wordmarkColor: {
    default: WordmarkColorIcon,
  },
  wordmarkDark: {
    default: WordmarkDarkIcon,
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
  likeIcon: {
    default: LikeIcon,
  },
  commentIcon: {
    default: CommentIcon,
  },
  checkBlack: {
    default: CheckBlackIcon,
  },
  downloadIcon: {
    default: DownloadIcon,
  },
  infoIcon: {
    default: InfoIcon,
  },
  bigLikeIcon: {
    default: LikeBigIcon,
    active: LikeBigFilledIcon,
  },
  bigLikeOutlineIcon: {
    default: LikeBigOutlineIcon,
    active: LikeBigFilledIcon,
  },
  minusIcon: {
    default: MinusIcon,
  },
  plusIcon: {
    default: PlusIcon,
  },
  plusIconPoint: {
    default: PlusIconPoint,
  },
  closeGray: {
    default: CloseGrayIcon,
  },
  empty: {
    default: EmptyIcon,
  },
  homeBlack: {
    default: HomeBlackIcon,
  },
  instagram: {
    default: InstagramIcon,
  },
  /** 쇼룸 프로필의 인스타 채널 버튼 — 디자인이 지정한 글리프 */
  instagramGlyph: {
    default: InstagramGlyphIcon,
  },
  youtube: {
    default: YoutubeIcon,
  },
  // TODO : 아이콘 추가 후 수정
  tiktok: {
    default: InstagramIcon,
  },
  x: {
    default: InstagramIcon,
  },
  externalArrow: {
    default: ExternalArrowIcon,
  },
  gift: {
    default: GiftIcon,
  },
  question: {
    default: QuestionIcon,
  },
  answer: {
    default: AnswerIcon,
  },
  followingGrayIcon: {
    default: FollowingGrayIcon,
  },
};
