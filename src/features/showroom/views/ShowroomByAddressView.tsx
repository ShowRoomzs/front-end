import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { View } from "react-native";

import { StorefrontIcon } from "@/common/components/DsIcon/icons";
import EmptyState from "@/common/components/EmptyState/EmptyState";
import { queryClient } from "@/common/lib/queryClient";
import { useCommonNavigation, useMainNavigation } from "@/common/router";
import { COMMON_ROUTES, ROOT_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import { SHOWROOM_QUERY_KEY } from "@/features/showroom/constants/queryKey";
import { showroomService } from "@/features/showroom/services/showroomService";

/**
 * 쇼룸 핸들 주소(`m.showroomz.co.kr/@handle`)로 들어온 사람을 쇼룸으로 보낸다.
 *
 * 크리에이터가 SNS 프로필에 거는 링크가 이 모양이다(서버 showroomUrl = `${app.base-url}/@{showroomAddress}`).
 * 핸들로 쇼룸을 찾고(`GET /user/showrooms/by-address/{address}` · 11-15) 받은 상세를 캐시에 넣은 뒤
 * 쇼룸 화면으로 **바꿔치운다**(뒤로가기에 이 화면이 남지 않게).
 *
 * 웹은 주소 `/@handle`을 시작할 때 `/u/handle`로 바꿔 이 화면에 닿는다(webPaths.web.ts) — 경로 규칙은
 * 「@」가 붙은 조각을 변수로 받지 못한다.
 */
export default function ShowroomByAddressView() {
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.SHOWROOM_BY_ADDRESS>>();
  const navigation = useCommonNavigation();
  const mainNavigation = useMainNavigation();
  const { showroomAddress, from } = route.params;

  const { data, isError } = useQuery({
    queryKey: [SHOWROOM_QUERY_KEY.SHOWROOM_BY_ADDRESS, showroomAddress],
    queryFn: () => showroomService.getDetailByAddress(showroomAddress),
    enabled: !!showroomAddress,
    retry: false,
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    queryClient.setQueryData([SHOWROOM_QUERY_KEY.SHOWROOM_DETAIL, data.showroomId], data);
    navigation.replace(COMMON_ROUTES.SHOWROOM_DETAIL, { showroomId: data.showroomId, from });
  }, [data, from, navigation]);

  if (isError) {
    return (
      <View className="flex-1 bg-white">
        <EmptyState
          fill
          icon={<StorefrontIcon size={52} />}
          title="쇼룸을 찾을 수 없어요"
          description={"주소가 바뀌었거나\n더 이상 공개하지 않는 쇼룸이에요"}
          // 링크로 바로 들어온 사람은 돌아갈 화면이 없다 — 홈으로 보낸다
          actionLabel="홈으로 가기"
          onPressAction={() => mainNavigation.navigate(ROOT_ROUTES.HOME)}
        />
      </View>
    );
  }

  // 찾는 동안은 빈 흰 화면 — 곧 쇼룸 화면으로 바뀐다
  return <View className="flex-1 bg-white" />;
}
