import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Avatar from "@/common/components/Avatar/Avatar";
import { MoreIcon } from "@/common/components/DsIcon/icons";
import LikeButton from "@/common/components/LikeButton/LikeButton";
import MediaCarousel from "@/common/components/MediaCarousel/MediaCarousel";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import { useCommonNavigation } from "@/common/router";
import { COMMON_ROUTES } from "@/common/router/routes";
import { CommonStackParamList } from "@/common/router/types";
import { formatRelativeTime } from "@/common/utils/formatRelativeTime";
import { useFeedActions } from "@/features/post/hooks/useFeedActions";
import { useGetPostDetail } from "@/features/post/hooks/useGetPostDetail";

/**
 * 게시물 상세 — 피드·쇼룸의 카드를 탭하면 열린다.
 *
 * 카드가 요약이라면 여기서는 본문을 접지 않고 전부 편다. 사진도 잘리지 않은 원래 비율로 보여준다.
 *
 * C5 공구 게시물 상세(D-day · 상품 묶음 · 판매자 고지)는 서버에 공구 게시물이 아직 없어
 * 여기 붙지 않는다. 일반 게시물은 이 화면이 그대로 상세다.
 */
export default function PostDetailView() {
  const route = useRoute<RouteProp<CommonStackParamList, typeof COMMON_ROUTES.POST_DETAIL>>();
  const { postId } = route.params;
  const navigation = useCommonNavigation();
  const { width } = useWindowDimensions();

  const { data: post, isLoading } = useGetPostDetail(postId);
  const { handlePressShowroom, handlePressLike, handlePressMore } = useFeedActions();

  return (
    <View className="flex-1 bg-white">
      <View className="border-b-[0.5px] border-divider bg-white">
        <View className="h-46 flex-row items-center" style={{ paddingLeft: 2, paddingRight: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.4} className="p-11">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 5l-7 7 7 7"
                stroke="#0F0F0F"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Typography
            style={{ fontSize: 16, fontWeight: "600", lineHeight: 16, letterSpacing: -0.3 }}
            className="flex-1"
            numberOfLines={1}
          >
            게시물
          </Typography>
        </View>
      </View>

      {isLoading || !post ? (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="flex-row items-center px-14 pb-10 pt-12" style={{ gap: 10 }}>
            <TouchableOpacity
              onPress={() => handlePressShowroom(post.showroomId)}
              activeOpacity={0.7}
              className="min-w-0 flex-1 flex-row items-center"
              style={{ gap: 10 }}
            >
              <Avatar imageUrl={post.showroomImageUrl} size={36} />
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
              style={{ padding: 12, margin: -12 }}
            >
              <MoreIcon size={20} />
            </TouchableOpacity>
          </View>

          {post.imageUrls.length > 0 && (
            <MediaCarousel imageUrls={post.imageUrls} width={width} aspectRatio={post.aspectRatio} />
          )}

          <View className="flex-row px-14" style={{ paddingTop: post.imageUrls.length > 0 ? 4 : 10 }}>
            <LikeButton
              isLiked={post.isLiked}
              likeCount={post.likeCount}
              likeLocked={post.likeLocked}
              onPress={() => handlePressLike(post.postId, post.isLiked)}
            />
          </View>

          {!!post.content && (
            <Typography variant="body" style={{ lineHeight: 20.9 }} className="px-14 pt-9 text-ink">
              <Typography style={{ fontWeight: "600" }}>{post.showroomName}</Typography> {post.content}
            </Typography>
          )}
        </ScrollView>
      )}
    </View>
  );
}
