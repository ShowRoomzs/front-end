import { demoDelay } from "@/demo/config";
import { DEMO_SHOWROOMS } from "@/demo/data/showrooms";
import { DEMO_ADDRESSES, DEMO_USER } from "@/demo/data/user";
import { demoPage } from "@/demo/services/shared";
import { demoStore } from "@/demo/store";
import { RegisterResponse, SocialLoginResponse } from "@/features/auth/types/auth";
import { Address, AddressRequest } from "@/features/mypage/types/address";
import { RecentSearchParams } from "@/features/search/types/params";
import { RecentSearchResponse } from "@/features/search/types/recentSearch";
import {
  CheckNicknameCode,
  CheckNicknameResponse,
  UpdateUserRequest,
  User,
} from "@/features/user/types/user";

/** 시연 중 프로필을 고쳐도 화면에 반영되도록 메모리에 얹어 둔다 */
let currentUser: User = { ...DEMO_USER };
let addresses: Array<Address> = [...DEMO_ADDRESSES];

export const demoUserService = {
  get: () => demoDelay(currentUser),

  update: async (data: UpdateUserRequest) => {
    currentUser = { ...currentUser, ...data, modifiedAt: new Date() };
    return currentUser;
  },

  checkNickname: (nickname: string): Promise<CheckNicknameResponse<CheckNicknameCode>> =>
    demoDelay(
      nickname.trim().length < 2
        ? { isAvailable: false, code: "INVALID_FORMAT", message: "2자 이상 입력해 주세요" }
        : { isAvailable: true, code: "AVAILABLE", message: "사용할 수 있는 닉네임이에요" }
    ),
};

/**
 * 데모 인증.
 *
 * 로그아웃한 뒤 카카오·네이버 버튼을 누르면 **SDK는 실제로 뜬다**(네이티브 설정이 그대로이므로).
 * 서버 검증만 여기서 통과시켜 기존 회원으로 로그인시킨다 — 가입 흐름을 보여 줄 자리가 아니라
 * "로그인하면 내 피드가 채워진다"를 보여 줄 자리이기 때문이다.
 */
const DEMO_TOKEN: RegisterResponse = {
  tokenType: "Bearer",
  accessToken: "demo-access-token",
  refreshToken: "demo-refresh-token",
  accessTokenExpiresIn: 60 * 60 * 24 * 30,
  refreshTokenExpiresIn: 60 * 60 * 24 * 90,
};

export const demoAuthService = {
  socialLogin: (): Promise<SocialLoginResponse> => demoDelay({ ...DEMO_TOKEN, isNewMember: false }),
  register: (): Promise<RegisterResponse> => demoDelay(DEMO_TOKEN),
  refresh: (): Promise<RegisterResponse> => demoDelay(DEMO_TOKEN),
};

export const demoAddressService = {
  get: () => demoDelay(addresses),

  getDetail: (addressId: number) => demoDelay(addresses.find(item => item.id === addressId) ?? addresses[0]),

  create: async (address: AddressRequest) => {
    const created: Address = { ...address, id: demoStore.nextId() };

    addresses = address.default
      ? [created, ...addresses.map(item => ({ ...item, default: false }))]
      : [...addresses, created];
    return created;
  },

  update: async (addressId: number, address: AddressRequest) => {
    const updated: Address = { ...address, id: addressId };

    addresses = addresses.map(item => (item.id === addressId ? updated : item));
    return updated;
  },

  delete: async (addressId: number) => {
    addresses = addresses.filter(item => item.id !== addressId);
    return undefined;
  },

  setDefault: async (addressId: number) => {
    addresses = addresses.map(item => ({ ...item, default: item.id === addressId }));
    return undefined;
  },
};

export const demoRecentSearchService = {
  get: (params: RecentSearchParams): Promise<RecentSearchResponse> =>
    demoDelay(demoPage(demoStore.recentSearches(), { page: 1, size: params.size })),

  create: async (keyword: string) => {
    demoStore.addRecentSearch({ type: "TERM", term: keyword, showroom: null });
    return undefined;
  },

  createShowroom: async (showroomId: number) => {
    const showroom = DEMO_SHOWROOMS.find(item => item.showroomId === showroomId);

    if (showroom) {
      demoStore.addRecentSearch({
        type: "SHOWROOM",
        term: showroom.showroomName,
        showroom: {
          showroomId: showroom.showroomId,
          showroomName: showroom.showroomName,
          showroomAddress: showroom.showroomAddress,
          showroomImageUrl: showroom.showroomImageUrl,
          hasOngoingGroupBuy: showroom.hasOngoingGroupBuy,
        },
      });
    }
    return undefined;
  },

  delete: async (id: number) => {
    demoStore.removeRecentSearch(id);
    return undefined;
  },

  deleteAll: async () => {
    demoStore.clearRecentSearches();
    return undefined;
  },

  sync: async () => undefined,
};
