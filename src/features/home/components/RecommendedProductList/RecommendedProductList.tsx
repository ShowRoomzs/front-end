import { View } from "react-native";

import { useParams } from "@/common/hooks/useParams";
import { useGetRecommendations } from "@/common/queries/useGetRecommendations";
import { RecommendationParams } from "@/common/types/recommendation";

interface RecommendedProductListProps {
  categoryId: number | null;
}

const INITIAL_PARAMS: Omit<RecommendationParams, "page"> = {
  size: 10,
  categoryId: null,
};

export default function RecommendedProductList(props: RecommendedProductListProps) {
  const { categoryId } = props;
  const { params } = useParams<Omit<RecommendationParams, "page">>({
    ...INITIAL_PARAMS,
    categoryId,
  });

  const { content } = useGetRecommendations(params);

  console.log("content", content);

  return <View></View>;
}
