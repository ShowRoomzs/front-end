import { ReactNode } from "react";
import { View } from "react-native";

import ErrorState from "@/common/components/ErrorState/ErrorState";
import { SkeletonOverlay } from "@/common/components/Skeleton/Skeleton";

/**
 * 상세 화면의 첫 로드 자리 — 스켈레톤 → 콘텐츠 크로스페이드, 한 번도 못 받으면 전체 오류(§07).
 *
 * 상세 화면은 「불러오는 중이면 머리말 + 자리 표시만 돌려주는」 이른 return을 쓴다. 그 분기와 본문 분기에서
 * 머리말 바로 아래에 **같은 `key`의 `LoadGate`**를 두면 React가 이 View를 그대로 이어 쓰고, 안의
 * 스켈레톤만 내려가 200ms 퇴장이 돈다(분기를 통째로 갈아 끼우면 부모째 사라져 퇴장이 안 돈다).
 *
 * ```tsx
 * if (!order) return <Screen><Header /><LoadGate key="gate" query={query} skeleton={<…Skeleton />} /></Screen>;
 * return <Screen><Header /><LoadGate key="gate" query={query} skeleton={<…Skeleton />}>{본문}</LoadGate></Screen>;
 * ```
 *
 * - 자리 표시: 데이터가 없고 받는 중일 때 — 첫 진입과 오류 뒤 [다시 시도] 모두.
 * - 전체 오류: 데이터가 없고 받기를 멈췄는데 실패했을 때. 이미 받은 데이터의 갱신 실패는 여기서 다루지 않는다.
 */
interface LoadGateQuery {
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
}

interface LoadGateProps {
  query: LoadGateQuery;
  skeleton: ReactNode;
  /** 본문 — 데이터가 생기면 넘긴다. 없으면 자리 표시나 오류가 그 자리를 채운다 */
  children?: ReactNode;
}

export default function LoadGate(props: LoadGateProps) {
  const { query, skeleton, children } = props;
  const hasContent = children !== undefined && children !== null && children !== false;
  const isWaiting = !hasContent && query.isFetching;
  const isFailed = !hasContent && !query.isFetching && query.isError;

  return (
    <View className="flex-1">
      {children}
      {isFailed && <ErrorState error={query.error} onRetry={() => void query.refetch()} />}
      <SkeletonOverlay visible={isWaiting}>{skeleton}</SkeletonOverlay>
    </View>
  );
}
