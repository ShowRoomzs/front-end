import { PageParams } from "@/common/types/page";
import { demoDelay } from "@/demo/config";
import { DEMO_POSTS } from "@/demo/data/posts";
import { DEMO_SHOWROOMS, DemoShowroom, demoShowroom } from "@/demo/data/showrooms";
import { demoPage } from "@/demo/services/shared";
import { demoStore } from "@/demo/store";
import {
  FollowingShowroom,
  FollowingShowroomSort,
  ShowroomDetail,
  ShowroomListItem,
  ShowroomSearchItem,
} from "@/features/showroom/types/showroom";

function postCount(showroomId: number) {
  return DEMO_POSTS.filter(post => post.showroomId === showroomId).length;
}

function toListItem(showroom: DemoShowroom): ShowroomListItem {
  return {
    showroomId: showroom.showroomId,
    showroomName: showroom.showroomName,
    showroomAddress: showroom.showroomAddress,
    showroomImageUrl: showroom.showroomImageUrl,
    introduction: showroom.introduction,
    hasOngoingGroupBuy: showroom.hasOngoingGroupBuy,
    isFollowing: demoStore.isFollowing(showroom.showroomId),
  };
}

function toSearchItem(showroom: DemoShowroom): ShowroomSearchItem {
  return {
    showroomId: showroom.showroomId,
    showroomName: showroom.showroomName,
    showroomAddress: showroom.showroomAddress,
    showroomImageUrl: showroom.showroomImageUrl,
    hasOngoingGroupBuy: showroom.hasOngoingGroupBuy,
  };
}

/** 이름과 아이디(@handle)만 검색 대상이다 — C14의 규칙을 그대로 따른다 */
function matches(showroom: DemoShowroom, keyword?: string) {
  if (!keyword) {
    return true;
  }
  const q = keyword.trim().toLowerCase();

  return (
    showroom.showroomName.toLowerCase().includes(q) || showroom.showroomAddress.toLowerCase().includes(q)
  );
}

export const demoShowroomService = {
  getList: (params: PageParams & { keyword?: string }) =>
    demoDelay(demoPage(DEMO_SHOWROOMS.filter(s => matches(s, params.keyword)).map(toListItem), params)),

  getDetail: (showroomId: number): Promise<ShowroomDetail> => {
    const showroom = demoShowroom(showroomId);
    const isFollowing = demoStore.isFollowing(showroomId);

    return demoDelay({
      showroomId: showroom.showroomId,
      showroomName: showroom.showroomName,
      showroomAddress: showroom.showroomAddress,
      showroomImageUrl: showroom.showroomImageUrl,
      introduction: showroom.introduction,
      instagramUrl: showroom.instagramUrl,
      postCount: postCount(showroomId),
      followerCount: showroom.followerCount + (isFollowing && !showroom.isFollowing ? 1 : 0),
      hasOngoingGroupBuy: showroom.hasOngoingGroupBuy,
      isFollowing,
    });
  },

  getFollowing: (params: PageParams & { sort?: FollowingShowroomSort }) => {
    const followed = demoStore.followedShowroomIds();
    const items: Array<FollowingShowroom> = DEMO_SHOWROOMS.filter(s => followed.includes(s.showroomId)).map(
      showroom => ({
        showroomId: showroom.showroomId,
        showroomName: showroom.showroomName,
        showroomImageUrl: showroom.showroomImageUrl,
        hasOngoingGroupBuy: showroom.hasOngoingGroupBuy,
        followedAt: new Date(Date.now() - showroom.showroomId * 86400000).toISOString(),
      })
    );

    if (params.sort === "FOLLOW_OLDEST") {
      items.reverse();
    }
    return demoDelay(demoPage(items, params));
  },

  follow: async (showroomId: number) => {
    demoStore.setFollowing(showroomId, true);
  },

  unfollow: async (showroomId: number) => {
    demoStore.setFollowing(showroomId, false);
  },

  recordVisit: async () => undefined,

  search: (params: PageParams & { keyword?: string }) =>
    demoDelay(demoPage(DEMO_SHOWROOMS.filter(s => matches(s, params.keyword)).map(toSearchItem), params)),

  getActive: (size?: number) =>
    demoDelay(
      DEMO_SHOWROOMS.filter(s => s.hasOngoingGroupBuy)
        .slice(0, size ?? 4)
        .map(toSearchItem)
    ),
};
