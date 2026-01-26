import { RouteProp, useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";

import { COMMON_ROUTES } from "@/common/router/routes";
import { ProductStackParamList } from "@/common/router/types";

export default function ProductDetailView() {
  const route = useRoute<RouteProp<ProductStackParamList, typeof COMMON_ROUTES.PRODUCT_DETAIL>>();

  console.log("route", route);

  return (
    <View>
      <Text>asdf</Text>
    </View>
  );
}
