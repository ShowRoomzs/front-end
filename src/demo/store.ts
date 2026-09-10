import { DEMO_POSTS } from "@/demo/data/posts";
import { DEMO_SHOWROOMS } from "@/demo/data/showrooms";
import { RecentSearchItemResponse } from "@/features/search/types/recentSearch";

/**
 * 데모의 가변 상태 — 팔로우 · 좋아요 · 장바구니 · 최근 검색 · 새로 쓴 문의.
 *
 * **메모리에만 산다.** 앱을 껐다 켜면 처음 상태로 돌아오는데, 데모에서는 그 편이 낫다 —
 * 같은 시연을 여러 번 반복할 때 앞사람이 눌러 둔 흔적이 남지 않는다.
 *
 * zustand를 쓰지 않는 이유는 화면이 이 값을 직접 구독하지 않기 때문이다. 서비스가 응답을 만들
 * 때만 읽고, 화면 갱신은 지금처럼 React Query 캐시(낙관적 갱신 + 무효화)가 담당한다.
 */
export interface DemoCartEntry {
  cartId: number;
  productId: number;
  variantId: number;
  quantity: number;
  /** 체크박스 상태는 장바구니 화면이 파라미터로 넘겨 주므로 여기 두지 않는다 */
}

export interface DemoInquiryEntry {
  id: number;
  productId: number;
  typeName: string;
  content: string;
  secret: boolean;
  createdAt: string;
}

interface DemoState {
  followedShowroomIds: Set<number>;
  likedPostIds: Set<number>;
  cart: Array<DemoCartEntry>;
  recentSearches: Array<RecentSearchItemResponse>;
  /** 데모 중에 사용자가 직접 쓴 상품 문의 — 목록 맨 위에 얹는다 */
  writtenInquiries: Array<DemoInquiryEntry>;
  nextId: number;
}

function initialState(): DemoState {
  return {
    followedShowroomIds: new Set(DEMO_SHOWROOMS.filter(s => s.isFollowing).map(s => s.showroomId)),
    likedPostIds: new Set(DEMO_POSTS.filter(p => p.isLiked).map(p => p.postId)),
    cart: [
      // 아누아 세럼 단품 30ml · 세타필 크림 550g 2개 기획 — 무료배송 기준(3만원)을 넘겨 둔다
      { cartId: 9001, productId: 1001, variantId: 100100, quantity: 1 },
      { cartId: 9002, productId: 1004, variantId: 100401, quantity: 1 },
    ],
    recentSearches: [],
    writtenInquiries: [],
    nextId: 9100,
  };
}

const state: DemoState = initialState();

export const demoStore = {
  // ── 팔로우 ────────────────────────────────────────────────
  isFollowing(showroomId: number) {
    return state.followedShowroomIds.has(showroomId);
  },
  setFollowing(showroomId: number, following: boolean) {
    if (following) {
      state.followedShowroomIds.add(showroomId);
    } else {
      state.followedShowroomIds.delete(showroomId);
    }
  },
  followedShowroomIds() {
    return [...state.followedShowroomIds];
  },

  // ── 좋아요 ────────────────────────────────────────────────
  isLiked(postId: number) {
    return state.likedPostIds.has(postId);
  },
  setLiked(postId: number, liked: boolean) {
    if (liked) {
      state.likedPostIds.add(postId);
    } else {
      state.likedPostIds.delete(postId);
    }
  },
  likedPostIds() {
    return [...state.likedPostIds];
  },

  // ── 장바구니 ──────────────────────────────────────────────
  cart() {
    return state.cart;
  },
  addToCart(items: Array<{ productId?: number; variantId: number; quantity: number }>) {
    items.forEach(item => {
      const exist = state.cart.find(entry => entry.variantId === item.variantId);

      if (exist) {
        exist.quantity = Math.min(99, exist.quantity + item.quantity);
        return;
      }
      state.cart.push({
        cartId: state.nextId++,
        productId: item.productId ?? 0,
        variantId: item.variantId,
        quantity: item.quantity,
      });
    });
  },
  updateCart(cartId: number, variantId: number, quantity: number) {
    const entry = state.cart.find(item => item.cartId === cartId);

    if (entry) {
      entry.variantId = variantId;
      entry.quantity = quantity;
    }
  },
  removeFromCart(cartIds: Array<number>) {
    state.cart = state.cart.filter(entry => !cartIds.includes(entry.cartId));
  },

  // ── 최근 검색 ─────────────────────────────────────────────
  recentSearches() {
    return state.recentSearches;
  },
  addRecentSearch(item: Omit<RecentSearchItemResponse, "id" | "createdAt">) {
    state.recentSearches = [
      { ...item, id: state.nextId++, createdAt: new Date().toISOString() },
      ...state.recentSearches.filter(entry => !(entry.type === item.type && entry.term === item.term)),
    ].slice(0, 10);
  },
  removeRecentSearch(id: number) {
    state.recentSearches = state.recentSearches.filter(entry => entry.id !== id);
  },
  clearRecentSearches() {
    state.recentSearches = [];
  },

  // ── 사용자가 쓴 문의 ──────────────────────────────────────
  writtenInquiries(productId: number) {
    return state.writtenInquiries.filter(entry => entry.productId === productId);
  },
  addInquiry(entry: Omit<DemoInquiryEntry, "id" | "createdAt">) {
    const id = state.nextId++;

    state.writtenInquiries = [
      { ...entry, id, createdAt: new Date().toISOString() },
      ...state.writtenInquiries,
    ];
    return id;
  },

  nextId() {
    return state.nextId++;
  },
};
