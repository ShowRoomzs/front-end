import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Avatar from "@/common/components/Avatar/Avatar";
import { MoreIcon } from "@/common/components/DsIcon/icons";
import HeaderActions from "@/common/components/HeaderActions/HeaderActions";
import LikeButton from "@/common/components/LikeButton/LikeButton";
import MediaCarousel from "@/common/components/MediaCarousel/MediaCarousel";
import ScreenHeader from "@/common/components/ScreenHeader/ScreenHeader";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import { formatRelativeTime } from "@/common/utils/formatRelativeTime";
import PostBadgeRow from "@/features/post/components/PostBadgeRow/PostBadgeRow";
import PostProductList from "@/features/post/components/PostProductList/PostProductList";
import { useFeedActions } from "@/features/post/hooks/useFeedActions";
import { useGetPostDetail } from "@/features/post/hooks/useGetPostDetail";

/**
 * C5 게시물 상세 — 피드·쇼룸의 카드를 탭하면 열린다.
 *
 * 카드가 요약이라면 여기서는 **본문을 접지 않고 전부 편다.** 자세한 설명을 보러 들어온 화면에서
 * 다시 [더 보기]를 누르게 하면 목적이 무너진다. 상품도 접지 않고 전부 펼친다.
 *
 * **좋아요는 맨 아래다.** 글과 상품을 다 보고 난 뒤에 누르는 동작이라, 글 위에 두면 판단하기 전에
 * 결정을 요구하는 셈이 된다(피드 카드에서 미디어 바로 아래에 두는 것과 반대 이유다).
 *
 * ⋯는 **세로**다 — 목록 안의 항목 메뉴(가로 ⋯)와 화면 하나에 대한 메뉴를 방향으로 구분한다.
 *
 * 배송비·마감 같은 거래 조건은 상품 상세(C7)가 채우므로 게시물에서 중복해 적지 않는다.
 */
export default function PostDetailView() {
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.POST_DETAIL>>();
  const { postId } = route.params;
  const navigation = useCommonNavigation();
  const { width } = useWindowDimensions();
  // 스택 네비게이터는 상단 인셋만 잡는다 — 아래로 끝까지 흐르는 화면은 각자 하단을 비운다
  const { bottom } = useSafeAreaInsets();

  const { data: post, isLoading } = useGetPostDetail(postId);
  const { handlePressShowroom, handlePressProduct, handlePressLike, handlePressMore } = useFeedActions();

  if (isLoading || !post) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="게시물" onPressBack={navigation.goBack} renderRight={<HeaderActions />} />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  const { groupBuy } = post;
  const hasMedia = post.imageUrls.length > 0;

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="게시물" onPressBack={navigation.goBack} renderRight={<HeaderActions />} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottom + 30 }}>
        <View className="flex-row items-center px-14 py-13" style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={() => handlePressShowroom(post.showroomId)}
            activeOpacity={0.7}
            className="min-w-0 flex-1 flex-row items-center"
            style={{ gap: 10 }}
          >
            <Avatar imageUrl={post.showroomImageUrl} size={36} hasOngoingGroupBuy={!!groupBuy} />
            <View className="min-w-0 flex-1 flex-row items-center" style={{ gap: 5 }}>
              <Typography variant="handle" className="shrink text-ink" numberOfLines={1}>
                {post.showroomName}
              </Typography>
              <Typography style={{ fontSize: 13, lineHeight: 16.9 }} className="flex-none text-gray55">
                · {formatRelativeTime(post.publishedAt)}
              </Typography>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePressMore(post.postId)}
            activeOpacity={0.4}
            style={{ padding: 11, margin: -11 }}
          >
            <MoreIcon size={20} color="#8E8E8E" vertical />
          </TouchableOpacity>
        </View>

        {!!groupBuy && <PostBadgeRow groupBuy={groupBuy} className="px-14 pt-4" />}

        {!!groupBuy && (
          <Typography
            style={{
              fontSize: 17,
              fontWeight: "700",
              lineHeight: 24.65,
              letterSpacing: -0.4,
              paddingTop: 11,
            }}
            className="px-14 text-ink"
          >
            {groupBuy.title}
          </Typography>
        )}

        {!!post.content && (
          <Typography
            style={{ fontSize: 14, lineHeight: 24.5, marginTop: groupBuy ? 9 : 11 }}
            className="px-14 text-ink76"
          >
            {post.content}
          </Typography>
        )}

        {hasMedia && (
          <View style={{ marginTop: 14 }}>
            <MediaCarousel imageUrls={post.imageUrls} width={width} aspectRatio={post.aspectRatio} />
          </View>
        )}

        {!!groupBuy && groupBuy.products.length > 0 && (
          <>
            <View className="flex-row items-baseline px-14 pb-10 pt-20" style={{ gap: 7 }}>
              <Typography
                style={{ fontSize: 15, fontWeight: "700", lineHeight: 15, letterSpacing: -0.2 }}
                className="text-ink"
              >
                공구 상품
              </Typography>
              <Typography style={{ fontSize: 15, fontWeight: "700", lineHeight: 15 }} className="text-gray45">
                {groupBuy.products.length}
              </Typography>
            </View>

            <PostProductList
              products={groupBuy.products}
              isClosed={groupBuy.status === "CLOSED"}
              expandedByDefault
              onPressProduct={handlePressProduct}
            />
          </>
        )}

        <View className="flex-row px-14" style={{ paddingTop: 14 }}>
          <LikeButton
            isLiked={post.isLiked}
            likeCount={post.likeCount}
            likeLocked={post.likeLocked || groupBuy?.status === "CLOSED"}
            onPress={() => handlePressLike(post.postId, post.isLiked)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
