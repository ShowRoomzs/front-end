import { View } from "react-native";

import { SkeletonBlock } from "@/common/components/Skeleton/Skeleton";
import { Band } from "@/features/order/components/OrderParts/OrderParts";

/**
 * 주문 · 클레임 상세류의 자리 표시 — `LoadGate`의 `skeleton`으로 넘긴다.
 *
 * 블록 틀은 각 화면이 쓰는 OrderParts · TrackingParts 수치를 그대로 따른다(머리 px-14 · 위 22 아래 18 ·
 * 섹션 제목 위 18 · 상품 줄 썸네일 64 · 간격 12 · 정보 행 위아래 6 · 밴드 5). 글자 블록 높이는 글자 크기의
 * 대략 0.8배라 줄 높이를 패딩으로 채운다.
 */

/** 날짜 제목 19 + 주문번호 12.5 — 주문 · 반품교환 · 취소 상세 머리 */
function HeadingSkeleton(props: { right?: boolean; paddingTop?: number; paddingBottom?: number }) {
  const { right = false, paddingTop = 22, paddingBottom = 18 } = props;

  return (
    <View className="flex-row items-end px-14" style={{ paddingTop, paddingBottom, gap: 12 }}>
      <View className="min-w-0 flex-1" style={{ gap: 11 }}>
        <SkeletonBlock width={148} height={18} />
        <SkeletonBlock width={156} height={11} sub />
      </View>
      {right && <SkeletonBlock width={46} height={11} sub />}
    </View>
  );
}

function SectionTitleSkeleton(props: { width?: number; paddingBottom?: number }) {
  const { width = 72, paddingBottom = 0 } = props;

  return (
    <View className="px-14" style={{ paddingTop: 18, paddingBottom }}>
      <SkeletonBlock width={width} height={14} />
    </View>
  );
}

/** 썸네일 64 + 브랜드 · 상품명 · 옵션 세 줄 — `ProductLine` */
function ProductLineSkeleton() {
  return (
    <View className="flex-row" style={{ gap: 12 }}>
      <SkeletonBlock width={64} height={64} />
      <View className="min-w-0 flex-1" style={{ gap: 8, paddingTop: 2 }}>
        <SkeletonBlock width="24%" height={9} sub />
        <SkeletonBlock width="72%" height={11} />
        <SkeletonBlock width="44%" height={9} sub />
      </View>
    </View>
  );
}

/** 상태 줄 + 상품 줄 + 버튼 두 개 — `OrderItemCard` detail */
function ItemSkeleton(props: { isFirst?: boolean; buttons?: boolean }) {
  const { isFirst = false, buttons = true } = props;

  return (
    <View className="px-14">
      {!isFirst && <View className="border-t-[0.5px] border-dividerProduct" style={{ marginTop: 4 }} />}
      <View style={{ paddingTop: 13 }}>
        <SkeletonBlock width="26%" height={12} />
      </View>
      <View style={{ paddingTop: 11, paddingBottom: 14 }}>
        <ProductLineSkeleton />
      </View>
      {buttons && (
        <View className="flex-row" style={{ gap: 7, paddingBottom: 14 }}>
          <SkeletonBlock height={40} style={{ flex: 1 }} />
          <SkeletonBlock height={40} style={{ flex: 1 }} />
        </View>
      )}
    </View>
  );
}

/** 왼쪽 라벨 + 오른쪽 값 — `InfoRow`(위아래 6 · 간격 14) */
function InfoRowsSkeleton(props: { count: number }) {
  return (
    <View className="px-14">
      {Array.from({ length: props.count }, (_, index) => (
        <View key={index} className="flex-row" style={{ gap: 14, paddingVertical: 10 }}>
          <SkeletonBlock width={56} height={11} sub />
          <SkeletonBlock width={index % 2 ? "38%" : "52%"} height={11} />
        </View>
      ))}
    </View>
  );
}

/** 라벨 · 금액 양끝 정렬 — `AmountRow`(간격 8) */
function AmountRowsSkeleton(props: { count: number; paddingTop?: number }) {
  const { count, paddingTop = 13 } = props;

  return (
    <View className="px-14" style={{ paddingTop, gap: 12 }}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} className="flex-row justify-between">
          <SkeletonBlock width={58} height={11} sub />
          <SkeletonBlock width={72} height={11} />
        </View>
      ))}
    </View>
  );
}

/** 결제 · 환불 합계 줄 — `TotalRow`(위 구분선 · 위 13) */
function TotalRowSkeleton() {
  return (
    <View
      className="mx-14 flex-row items-center justify-between border-t-[0.5px] border-dividerProduct"
      style={{ marginTop: 13, paddingTop: 13 }}
    >
      <SkeletonBlock width={64} height={13} />
      <SkeletonBlock width={96} height={16} />
    </View>
  );
}

/** C10-1 주문 상세 — 머리 · 배송지 · 주문 상품 · 결제 정보 */
export function OrderDetailSkeleton() {
  return (
    <View>
      <HeadingSkeleton paddingTop={20} paddingBottom={0} />
      <Band marginTop={20} />

      <SectionTitleSkeleton width={46} />
      <View className="px-14" style={{ paddingTop: 14, gap: 10 }}>
        <SkeletonBlock width={58} height={13} />
        <SkeletonBlock width="78%" height={11} sub />
        <SkeletonBlock width="40%" height={11} sub />
      </View>
      <Band marginTop={20} />

      <SectionTitleSkeleton />
      <ItemSkeleton isFirst />
      <Band />

      <SectionTitleSkeleton />
      <AmountRowsSkeleton count={3} />
      <TotalRowSkeleton />
    </View>
  );
}

/** C10-5 반품 · 교환 상세 · 취소 상세 — 머리 · 상품 · 신청 정보 · 결제(환불) 정보 */
export function ClaimDetailSkeleton(props: { infoRows?: number }) {
  const { infoRows = 5 } = props;

  return (
    <View>
      <HeadingSkeleton right />
      <Band />

      <SectionTitleSkeleton />
      <ItemSkeleton isFirst buttons={false} />
      <Band marginTop={6} />

      <SectionTitleSkeleton width={96} paddingBottom={8} />
      <InfoRowsSkeleton count={infoRows} />
      <Band marginTop={14} />

      <SectionTitleSkeleton />
      <AmountRowsSkeleton count={2} paddingTop={14} />
      <TotalRowSkeleton />
    </View>
  );
}

/** C10-2 배송 조회 · 회수 조회 — 제목 두 줄 · 단계 막대 · 주문 상품 · 송장 행 */
export function TrackingSkeleton() {
  return (
    <View>
      <View className="px-14" style={{ paddingTop: 22, gap: 12 }}>
        <SkeletonBlock width="64%" height={19} />
        <SkeletonBlock width="48%" height={11} sub />
      </View>

      <View className="flex-row px-14 pt-18" style={{ gap: 6 }}>
        {Array.from({ length: 4 }, (_, index) => (
          <View key={index} className="min-w-0 flex-1" style={{ gap: 10 }}>
            <SkeletonBlock height={3} radius={2} />
            <SkeletonBlock width="60%" height={9} sub />
          </View>
        ))}
      </View>
      <Band marginTop={22} />

      <View className="flex-row justify-between px-14" style={{ paddingTop: 18 }}>
        <SkeletonBlock width={128} height={13} />
        <SkeletonBlock width={46} height={11} sub />
      </View>
      <View className="px-14 pt-12">
        <ProductLineSkeleton />
      </View>
      <Band marginTop={20} />

      <View className="px-14 pt-18" style={{ gap: 14 }}>
        <SkeletonBlock width="56%" height={11} />
        <SkeletonBlock width="44%" height={11} />
      </View>
    </View>
  );
}

/**
 * 요청 · 결제 입력 화면(주문/결제 · 주문 취소 · 반품/교환 요청) — 상품 묶음 · 입력 섹션 · 금액.
 * 화면마다 입력 섹션 구성이 달라 섹션 머리 + 선택지 블록을 `sections`번 되풀이한다.
 */
export function OrderFormSkeleton(props: { sections?: number }) {
  const { sections = 2 } = props;

  return (
    <View>
      <SectionTitleSkeleton />
      <View className="px-14" style={{ paddingTop: 14, paddingBottom: 18 }}>
        <ProductLineSkeleton />
      </View>
      <Band />

      {Array.from({ length: sections }, (_, index) => (
        <View key={index}>
          <SectionTitleSkeleton width={index % 2 ? 64 : 88} />
          <View className="px-14" style={{ paddingTop: 14, paddingBottom: 20, gap: 8 }}>
            <SkeletonBlock height={48} />
            <SkeletonBlock height={48} />
          </View>
          <Band />
        </View>
      ))}

      <SectionTitleSkeleton />
      <AmountRowsSkeleton count={3} />
      <TotalRowSkeleton />
    </View>
  );
}
