import { memo } from "react";
import { TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";

import LikeButton from "@/common/components/LikeButton/LikeButton";
import MediaCarousel from "@/common/components/MediaCarousel/MediaCarousel";
import PostCaption from "@/features/post/components/PostCaption/PostCaption";
import PostCardHeader from "@/features/post/components/PostCardHeader/PostCardHeader";
import { FeedItem } from "@/features/post/types/post";

/**
 * 피드 게시물 카드 (C1 · C3 · C4 공통).
 *
 * 순서는 헤더 → 미디어 → 도트 → 좋아요 → 캡션이다. 캡션이 좋아요 아래에 오는 것은 의도된
 * 순서로, 사진을 본 직후의 동작(하트)을 손가락이 가장 가까운 자리에 둔 것이다.
 *
 * 카드 높이는 서버가 내려준 aspectRatio로 잡는다 — 게시물마다 비율이 달라 고정 높이로 만들면
 * 사진이 잘리거나 피드가 튄다.
 *
 * 공구 게시물(contentType === "GROUP_BUY")은 여기에 D-day 배지 · 제목 · 상품 묶음이 더 붙는다.
 * 서버가 아직 GENERAL만 내려주고 게시물에 붙는 상품 목록 필드 자체가 없어, 지금은 그리지 않는다.
 */
interface PostCardProps {
  item: FeedItem;
  hideRing?: boolean;
  hideFollowButton?: boolean;
  onPressPost: (postId: number) => void;
  onPressShowroom: (showroomId: number) => void;
  onPressFollow: (showroomId: number, isFollowing: boolean) => void;
  onPressLike: (postId: number, isLiked: boolean) => void;
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
    onPressMore,
  } = props;
  const { post } = item;
  const { width } = useWindowDimensions();

  const hasMedia = post.imageUrls.length > 0;

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

      {hasMedia && (
        <TouchableWithoutFeedback onPress={() => onPressPost(post.postId)}>
          <View>
            <MediaCarousel imageUrls={post.imageUrls} width={width} aspectRatio={post.aspectRatio} />
          </View>
        </TouchableWithoutFeedback>
      )}

      <View className="flex-row px-14" style={{ paddingTop: hasMedia ? 4 : 10 }}>
        <LikeButton
          isLiked={post.isLiked}
          likeCount={post.likeCount}
          likeLocked={post.likeLocked}
          onPress={() => onPressLike(post.postId, post.isLiked)}
        />
      </View>

      {!!post.content && (
        <PostCaption showroomName={post.showroomName} content={post.content} className="px-14 pt-9" />
      )}
    </View>
  );
}

export default memo(PostCard);
