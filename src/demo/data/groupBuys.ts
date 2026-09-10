import { DEMO_POSTS } from "@/demo/data/posts";
import { demoProduct } from "@/demo/data/products";
import { demoShowroom } from "@/demo/data/showrooms";
import { BundleProduct, ProductGroupBuy } from "@/features/product/types/product";

/**
 * 상품 → 그 상품이 묶인 공동구매.
 *
 * 게시물 데이터가 정본이다 — 같은 공구를 상품 쪽에 한 번 더 적어 두면 둘이 어긋나는 순간
 * "공구 카드에는 D-3인데 상세에는 D-5"처럼 시연 중에 바로 들키는 종류의 불일치가 생긴다.
 *
 * 한 상품이 여러 공구에 실려 있으면 **진행 중인 쪽을 먼저** 고른다. 마감된 공구를 상세에
 * 올리면 살 수 있는 상품이 못 사는 것처럼 보이기 때문이다.
 */
interface Resolved {
  groupBuy: ProductGroupBuy;
  /** 같은 공구에 함께 실린 다른 상품 */
  siblingIds: Array<number>;
}

function build(): Map<number, Resolved> {
  const map = new Map<number, Resolved>();

  DEMO_POSTS.forEach(post => {
    if (!post.groupBuy) {
      return;
    }
    const showroom = demoShowroom(post.showroomId);
    const isClosed = post.groupBuy.status === "CLOSED";

    post.groupBuy.productIds.forEach(productId => {
      const existing = map.get(productId);

      // 이미 진행 중인 공구가 잡혀 있으면 마감된 공구로 덮어쓰지 않는다
      if (existing && !existing.groupBuy.isClosed) {
        return;
      }

      map.set(productId, {
        groupBuy: {
          dday: post.groupBuy!.dday,
          isClosed,
          showroomId: showroom.showroomId,
          showroomName: showroom.showroomName,
          showroomImageUrl: showroom.showroomImageUrl,
        },
        siblingIds: post.groupBuy!.productIds.filter(id => id !== productId),
      });
    });
  });

  return map;
}

const RESOLVED = build();

export function demoProductGroupBuy(productId: number): ProductGroupBuy | null {
  return RESOLVED.get(productId)?.groupBuy ?? null;
}

/** [이 공구에서 함께 판매 중] — 같은 공구의 다른 상품. 혼자면 빈 배열이라 섹션이 사라진다 */
export function demoBundleProducts(productId: number): Array<BundleProduct> {
  const siblings = RESOLVED.get(productId)?.siblingIds ?? [];

  return siblings.map(id => {
    const product = demoProduct(id);

    return {
      id: product.id,
      name: product.name,
      thumbnailUrl: product.representativeImageUrl,
      discountRate: product.discountRate,
      salePrice: product.salePrice,
    };
  });
}
