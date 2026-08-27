import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { CATEGORY_ROUTES, COMMON_ROUTES } from "@/common/router/routes";
import { CategoryStackParamList, CommonStackParamList } from "@/common/router/types";
import CartView from "@/features/cart/views/CartView";
import CategoryDetailView from "@/features/category/views/CategoryDetailView";
import CategoryView from "@/features/category/views/CategoryView";
import NotificationView from "@/features/notification/views/NotificationView";
import PostDetailView from "@/features/post/views/PostDetailView";
import ProductDetailView from "@/features/product/views/ProductDetailView";
import ProductInquiryView from "@/features/product/views/ProductInquiryView";
import SearchView from "@/features/search/views/SearchView";
import ShowroomDetailView from "@/features/showroom/views/ShowroomDetailView";
import CommonTermsDocumentView from "@/features/terms/views/CommonTermsDocumentView";
import WishlistView from "@/features/wishlist/views/WishlistView";

const Stack = createNativeStackNavigator<CommonStackParamList>();
const CategoryStack = createNativeStackNavigator<CategoryStackParamList>();

/**
 * 카테고리는 탭에서 내려왔지만 화면은 그대로 살아 있다 — 쇼룸 검색과 마이에서 진입한다.
 * 스택을 통째로 옮겨 CategoryView·CategoryDetailView의 네비게이션 타입은 건드리지 않았다.
 */
function CategoryNavigator() {
  return (
    <CategoryStack.Navigator initialRouteName={CATEGORY_ROUTES.HOME} screenOptions={{ headerShown: false }}>
      <CategoryStack.Screen name={CATEGORY_ROUTES.HOME} component={CategoryView} />
      <CategoryStack.Screen name={CATEGORY_ROUTES.DETAIL} component={CategoryDetailView} />
    </CategoryStack.Navigator>
  );
}

// 앱 root 단에서 공통적으로 진입 가능한 stack들
export default function CommonNavigator() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={COMMON_ROUTES.SEARCH} component={SearchView} />
        <Stack.Screen name={COMMON_ROUTES.CART} component={CartView} />
        <Stack.Screen name={COMMON_ROUTES.NOTIFICATION} component={NotificationView} />
        <Stack.Screen name={COMMON_ROUTES.PRODUCT_DETAIL} component={ProductDetailView} />
        <Stack.Screen name={COMMON_ROUTES.PRODUCT_INQUIRY} component={ProductInquiryView} />
        <Stack.Screen name={COMMON_ROUTES.SHOWROOM_DETAIL} component={ShowroomDetailView} />
        <Stack.Screen name={COMMON_ROUTES.POST_DETAIL} component={PostDetailView} />
        <Stack.Screen name={COMMON_ROUTES.CATEGORY} component={CategoryNavigator} />
        <Stack.Screen name={COMMON_ROUTES.WISHLIST} component={WishlistView} />
        <Stack.Screen name={COMMON_ROUTES.TERMS_DOCUMENT} component={CommonTermsDocumentView} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
