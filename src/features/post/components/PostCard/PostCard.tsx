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
 * **사진이 없다** — 공구 게시물은 제목과 본문 글, 그리고 상품 묶음으로만 이뤄진다(시안 C1 · 백엔드 §24 비교표).
 * 한때 여기에도 캐러셀을 넣었다가 걷어냈다.
 * 여기서는 좋아요가 맨 아래다 — 읽고 상품까지 본 뒤에 누르는 동작이라 위에 두면 판단 전에
 * 결정을 요구하는 셈이 된다. 두 형태에서 좋아요 위치가 다른 것은 **보는 순서가 다르기** 때문이다.
 *
 * **일반 게시물의 사진은 피드에서 옆으로 넘긴다.** 그래서 미디어를 터치로 감싸지 않는다 —
 * 감싸면 넘기는 제스처를 가로챈다. 상세로 가는 길은 **공구 게시물의 제목 하나**뿐이고,
 * 일반 게시물은 상세가 없다(피드에서 보는 것이 전부다).
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
  /**
   * 끝난 공구는 헤더와 본문을 50%로 낮춘다(시안 C3).
   *
   * 배지와 좋아요 줄은 그대로 둔다 — 배지는 **왜** 흐려졌는지를 설명하는 유일한 글자고,
   * 좋아요는 끝난 뒤에도 해제할 수 있어야 해서 누를 수 있음이 보여야 한다.
   */
  const dimmedStyle = groupBuy?.status === "CLOSED" ? { opacity: 0.5 } : undefined;

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
      <View style={dimmedStyle}>
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
      </View>

      {groupBuy ? (
        <>
          <PostBadgeRow groupBuy={groupBuy} style={{ paddingBottom: 8 }} />

          <View style={dimmedStyle}>
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
          </View>

          {/* 끝난 공구처럼 상품 묶음이 비어 있으면 자리만 차지하는 여백이 남는다 */}
          {groupBuy.products.length > 0 && (
            <View style={{ marginTop: 14 }}>
              <PostProductList
                products={groupBuy.products}
                isClosed={groupBuy.status === "CLOSED"}
                onPressProduct={onPressProduct}
              />
            </View>
          )}

          {likeRow}
        </>
      ) : (
        <>
          {/*
            일반 게시물은 **상세로 들어가지 않는다** — 피드에서 보는 것이 전부다.
            공구와 달리 상세에 더 보여 줄 것(상품 묶음·공구 정보)이 없어, 들어가 봐야 같은 내용을
            한 번 더 보는 화면이었다. 터치 래퍼를 걷어내면 옆으로 넘기는 제스처도 가로채지 않는다.
          */}
          {hasMedia && (
            <MediaCarousel imageUrls={post.imageUrls} width={width} aspectRatio={post.aspectRatio} />
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
