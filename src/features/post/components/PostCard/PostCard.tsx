import { memo } from "react";
import { TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";

import LikeButton from "@/common/components/LikeButton/LikeButton";
import MediaCarousel from "@/common/components/MediaCarousel/MediaCarousel";
import Typography from "@/common/components/Typography/Typography";
import PostBadgeRow from "@/features/post/components/PostBadgeRow/PostBadgeRow";
import PostCaption from "@/features/post/components/PostCaption/PostCaption";
import PostCardHeader from "@/features/post/components/PostCardHeader/PostCardHeader";
import PostProductList from "@/features/post/components/PostProductList/PostProductList";
import { FeedItem } from "@/features/post/types/post";

/**
 * 피드 게시물 카드 (C1 · C3 · C4 공통) — 두 형태가 한 컴포넌트를 쓴다.
 *
 * **일반 게시물**  헤더 → 미디어 → 도트 → 좋아요 → 캡션.
 * 캡션이 좋아요 아래에 오는 것은 의도된 순서로, 사진을 본 직후의 동작(하트)을 손가락이 가장
 * 가까운 자리에 둔 것이다.
 *
 * **공구 게시물**  헤더 → 배지 → 제목 → 본문 → 상품 묶음 → 좋아요.
 * 여기서는 좋아요가 맨 아래다 — 읽고 상품까지 본 뒤에 누르는 동작이라 위에 두면 판단 전에
 * 결정을 요구하는 셈이 된다. 두 형태에서 좋아요 위치가 다른 것은 **보는 순서가 다르기** 때문이다.
 *
 * 카드 높이는 서버가 내려준 aspectRatio로 잡는다 — 게시물마다 비율이 달라 고정 높이로 만들면
 * 사진이 잘리거나 피드가 튄다.
 */
interface PostCardProps {
  item: FeedItem;
  hideRing?: boolean;
  hideFollowButton?: boolean;
  onPressPost: (postId: number) => void;
  onPressShowroom: (showroomId: number) => void;
  onPressFollow: (showroomId: number, isFollowing: boolean) => void;
  onPressLike: (postId: number, isLiked: boolean) => void;
  onPressProduct: (productId: number) => void;
  onPressMore: (postId: number) => void;
}

function PostCard(props: PostCardProps) {
  const {
    item,
    hideRing,
    hideFollowButton,
    onPressPost,
    onPressShowroom,
    onPressFollow,
    onPressLike,
    onPressProduct,
    onPressMore,
  } = props;
  const { post } = item;
  const { width } = useWindowDimensions();

  const { groupBuy } = post;
  const hasMedia = post.imageUrls.length > 0;

  const likeRow = (
    <View className="flex-row px-14" style={{ paddingTop: hasMedia && !groupBuy ? 4 : 14 }}>
      <LikeButton
        isLiked={post.isLiked}
        likeCount={post.likeCount}
        likeLocked={post.likeLocked || groupBuy?.status === "CLOSED"}
        onPress={() => onPressLike(post.postId, post.isLiked)}
      />
    </View>
  );

  return (
    <View className="border-b-[0.5px] border-divider bg-white pb-14 pt-12">
      <PostCardHeader
        showroomId={post.showroomId}
        showroomName={post.showroomName}
        showroomImageUrl={post.showroomImageUrl}
        hasOngoingGroupBuy={post.hasOngoingGroupBuy}
        isFollowing={post.isFollowing}
        publishedAt={post.publishedAt}
        hideRing={hideRing}
        hideFollowButton={hideFollowButton}
        onPressShowroom={onPressShowroom}
        onPressFollow={onPressFollow}
        onPressMore={() => onPressMore(post.postId)}
      />

      {groupBuy ? (
        <>
          <PostBadgeRow groupBuy={groupBuy} style={{ paddingBottom: 8 }} />

          <TouchableWithoutFeedback onPress={() => onPressPost(post.postId)}>
            <View className="px-14">
              <Typography
                style={{ fontSize: 16, fontWeight: "700", lineHeight: 23.2, letterSpacing: -0.4 }}
                className="text-ink"
              >
                {groupBuy.title}
              </Typography>
            </View>
          </TouchableWithoutFeedback>

          {!!post.content && (
            <PostCaption
              content={post.content}
              className="px-14"
              style={{ marginTop: 4 }}
              color="text-ink76"
              lineHeight={21.6}
            />
          )}

          <View style={{ marginTop: 14 }}>
            <PostProductList
              products={groupBuy.products}
              isClosed={groupBuy.status === "CLOSED"}
              onPressProduct={onPressProduct}
            />
          </View>

          {likeRow}
        </>
      ) : (
        <>
          {hasMedia && (
            <TouchableWithoutFeedback onPress={() => onPressPost(post.postId)}>
              <View>
                <MediaCarousel imageUrls={post.imageUrls} width={width} aspectRatio={post.aspectRatio} />
              </View>
            </TouchableWithoutFeedback>
          )}

          {likeRow}

          {!!post.content && (
            <PostCaption showroomName={post.showroomName} content={post.content} className="px-14 pt-9" />
          )}
        </>
      )}
    </View>
  );
}

export default memo(PostCard);
