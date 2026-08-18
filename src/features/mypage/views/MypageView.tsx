import { useCallback, useMemo } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BOTTOM_TABS_HEIGHT } from "@/common/components/BottomTabs/config";
import BusinessFooter from "@/common/components/BusinessFooter/BusinessFooter";
import { CartIcon } from "@/common/components/DsIcon/icons";
import GroupBand from "@/common/components/GroupBand/GroupBand";
import Icon from "@/common/components/Icon/Icon";
import LoginPrompt from "@/common/components/LoginPrompt/LoginPrompt";
import MenuGroup, { MenuItem } from "@/common/components/MenuGroup/MenuGroup";
import Typography from "@/common/components/Typography/Typography";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { useMainNavigation, useMypageNavigation } from "@/common/router";
import { COMMON_ROUTES, MYPAGE_ROUTES, MyPageRouteName, ROOT_ROUTES } from "@/common/router/routes";
import { useUserStore } from "@/common/stores/useUserStore";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { useCartItemCount } from "@/features/cart/hooks/useGetCart";
import MypageProfileCard from "@/features/mypage/components/MypageProfileCard/MypageProfileCard";
import OrderStatusCard, {
  OrderStatusItem,
} from "@/features/mypage/components/OrderStatusCard/OrderStatusCard";

/**
 * C 마이 — 활동 내역 허브.
 *
 * 프로필 · 주문 현황 4단계 · 쇼핑 정보 · 문의 · 도움말을 8px 회색 밴드로 끊는다.
 * 헤더 아이콘은 설정 · 장바구니 순이다.
 *
 * 주문 현황 4단계는 서버에 주문 API가 없어 지금은 모두 0(비활성)이다.
 */
const APP_VERSION = "1.0.0";

const ORDER_STATUS_LABELS: Array<Pick<OrderStatusItem, "key" | "label">> = [
  { key: "paid", label: "결제완료" },
  { key: "preparing", label: "상품준비중" },
  { key: "shipping", label: "배송중" },
  { key: "delivered", label: "배송완료" },
];

export default function MypageView() {
  const { user } = useUserStore();
  const inset = useSafeAreaInsets();
  const mainNavigation = useMainNavigation();
  const mypageNavigation = useMypageNavigation();
  const cartItemCount = useCartItemCount();

  const goMypage = useCallback(
    (routeName: MyPageRouteName) => {
      // 마이 스택의 화면은 모두 파라미터가 없어 이름만으로 이동한다
      mypageNavigation.navigate(routeName as never);
    },
    [mypageNavigation]
  );

  const handlePressSetting = usePermissionPress(() => goMypage(MYPAGE_ROUTES.SETTINGS));
  const handlePressOrders = usePermissionPress(() => goMypage(MYPAGE_ROUTES.ORDER_AND_DELIVERY_SEARCH));
  const handlePressAddress = usePermissionPress(() => goMypage(MYPAGE_ROUTES.ADDRESS_MANAGEMENT));
  const handlePressInquiryHistory = usePermissionPress(() => goMypage(MYPAGE_ROUTES.INQUIRY_HISTORY));
  const handlePressWishlist = usePermissionPress(() => {
    mainNavigation.navigate(ROOT_ROUTES.COMMON, { screen: COMMON_ROUTES.WISHLIST });
  });
  const handlePressCoupon = usePermissionPress(() => goMypage(MYPAGE_ROUTES.COUPON));

  const handlePressCart = useCallback(() => {
    mainNavigation.navigate(ROOT_ROUTES.COMMON, { screen: COMMON_ROUTES.CART });
  }, [mainNavigation]);

  // 주문 API가 없어 네 단계 모두 0이다 — 붙는 즉시 이 자리만 실제 값으로 바뀐다
  const orderStatusItems = useMemo(
    (): Array<OrderStatusItem> => ORDER_STATUS_LABELS.map(item => ({ ...item, count: 0 })),
    []
  );

  const shoppingItems = useMemo(
    (): Array<MenuItem> => [
      { key: "orders", label: "주문 내역", onPress: handlePressOrders },
      { key: "wishlist", label: "찜한 상품", onPress: handlePressWishlist },
      { key: "coupon", label: "쿠폰함", onPress: handlePressCoupon },
      { key: "address", label: "배송지 관리", onPress: handlePressAddress },
    ],
    [handlePressAddress, handlePressCoupon, handlePressOrders, handlePressWishlist]
  );

  const inquiryItems = useMemo(
    (): Array<MenuItem> => [
      { key: "inquiryHistory", label: "문의 내역", onPress: handlePressInquiryHistory },
      { key: "customerCenter", label: "고객센터", onPress: () => goMypage(MYPAGE_ROUTES.CUSTOMER_CENTER) },
      { key: "notice", label: "공지사항", onPress: () => goMypage(MYPAGE_ROUTES.NOTICE) },
    ],
    [goMypage, handlePressInquiryHistory]
  );

  const helpItems = useMemo(
    (): Array<MenuItem> => [
      {
        key: "terms",
        label: "서비스 이용약관",
        isPassive: true,
        onPress: () => goMypage(MYPAGE_ROUTES.SERVICE_AGREEMENT),
      },
      {
        key: "privacy",
        label: "개인정보 처리방침",
        isPassive: true,
        onPress: () => goMypage(MYPAGE_ROUTES.PRIVACY_POLICY),
      },
      {
        key: "license",
        label: "오픈소스 라이선스",
        isPassive: true,
        onPress: () => goMypage(MYPAGE_ROUTES.OPEN_LICENSE),
      },
      { key: "version", label: "버전 정보", isPassive: true, value: `v${APP_VERSION}` },
    ],
    [goMypage]
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center bg-white pb-12 pt-2" style={{ paddingHorizontal: 16 }}>
        <Typography style={{ fontSize: 18, fontWeight: "700", lineHeight: 18, letterSpacing: -0.5 }}>
          마이
        </Typography>
        <View className="flex-1" />
        <View className="flex-row" style={{ gap: 18 }}>
          <TouchableOpacity
            onPress={handlePressSetting}
            activeOpacity={0.6}
            style={{ padding: 9, margin: -9 }}
          >
            <Icon icon={COMMON_ASSETS.setting} width={25} height={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePressCart} activeOpacity={0.6} style={{ padding: 9, margin: -9 }}>
            <CartIcon size={25} />
            {cartItemCount > 0 && (
              <View
                className="absolute flex-row items-center justify-center rounded-full border-[1.5px] border-white bg-rose"
                style={{ top: -5, right: -7, minWidth: 18, height: 18, paddingHorizontal: 3 }}
              >
                <Typography style={{ fontSize: 10, lineHeight: 10 }} className="text-white">
                  {Math.min(cartItemCount, 99)}
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: inset.bottom + BOTTOM_TABS_HEIGHT }}
      >
        {user ? (
          <>
            <MypageProfileCard user={user} onPressProfile={handlePressSetting} />
            <View className="pb-18">
              <OrderStatusCard items={orderStatusItems} onPressStatus={handlePressOrders} />
            </View>
          </>
        ) : (
          <LoginPrompt
            title={"로그인하고\n공구 소식을 받아보세요"}
            description={"팔로우한 쇼룸의 새 공구와 주문 내역을\n한곳에서 확인할 수 있어요"}
          />
        )}

        <GroupBand />
        <MenuGroup title="쇼핑 정보" items={shoppingItems} />
        <GroupBand />
        <MenuGroup title="문의" items={inquiryItems} />
        <GroupBand />
        <MenuGroup title="도움말" items={helpItems} />
        <BusinessFooter />
      </ScrollView>
    </View>
  );
}
