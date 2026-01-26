import { RouteProp, useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";

import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";

export default function ProductDetailView() {
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.PRODUCT_DETAIL>>();

  return (
    <View>
      <Text>asdf</Text>
    </View>
  );
}
