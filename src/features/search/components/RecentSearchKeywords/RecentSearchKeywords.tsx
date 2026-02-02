import { View } from "react-native";

import { RecentSearch } from "@/features/search/types/recentSearch";

interface RecentSearchKeywordsProps {
  keywords: Array<RecentSearch>;
}
export default function RecentSearchKeywords(props: RecentSearchKeywordsProps) {
  const { keywords } = props;

  return <View></View>;
}
