import { ReactElement } from "react";
import { View } from "react-native";

import Skeleton from "@/common/components/Skeleton/Skeleton";
import Spinner from "@/common/components/Spinner/Spinner";

interface FooterComponentProps {
  isLoading: boolean;
  hasItems: boolean;
  /** 다음 페이지 — 목록 끝에 항목 하나의 자리 표시를 붙인다 */
  skeleton?: ReactElement;
}

export default function FooterComponent(props: FooterComponentProps) {
  const { isLoading, hasItems, skeleton } = props;

  if (isLoading && hasItems && skeleton) {
    return <Skeleton>{skeleton}</Skeleton>;
  }

  if (isLoading && hasItems) {
    return (
      <View className="py-20 items-center justify-center">
        <Spinner size={20} />
      </View>
    );
  }

  return null;
}
