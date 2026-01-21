import { RouteProp, useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";

import { CATEGORY_ROUTES } from "@/common/router";
import { CategoryStackParamList } from "@/common/router/types";

export default function CategoryDetailView() {
  const route = useRoute<RouteProp<CategoryStackParamList, typeof CATEGORY_ROUTES.DETAIL>>();
  const { categoryId } = route.params;

  return (
    <View>
      <Text>category detail: {categoryId}</Text>
    </View>
  );
}
