import { View } from "react-native";

import Avatar from "@/common/components/Avatar/Avatar";
import Checkbox from "@/common/components/Checkbox/Checkbox";
import Typography from "@/common/components/Typography/Typography";
import { formatPrice } from "@/common/utils/formatPrice";
import CartItemRow from "@/features/cart/components/CartItemRow/CartItemRow";
import { CartGroup, CartItem } from "@/features/cart/types/cart";

/**
 * 공구(쇼룸) 단위 묶음.
 *
 * 그룹 머리의 체크로 그 공구 전체를 켜고 끄되, 구매 불가 항목은 건너뛴다.
 * 그룹 끝에는 그 공구의 배송비를 붙인다 — 결제 화면에서 처음 알게 되는 배송비가
 * 가장 흔한 이탈 원인이라 담는 단계에서 미리 보여 준다.
 */
interface CartGroupSectionProps {
  group: CartGroup;
  selectedIds: Set<number>;
  onToggleSelect: (cartId: number) => void;
  onToggleGroup: (cartIds: Array<number>, nextSelected: boolean) => void;
  onChangeQuantity: (cartId: number, quantity: number) => void;
  onPressChangeOption: (item: CartItem) => void;
  onPressRemove: (cartId: number) => void;
}

export default function CartGroupSection(props: CartGroupSectionProps) {
  const {
    group,
    selectedIds,
    onToggleSelect,
    onToggleGroup,
    onChangeQuantity,
    onPressChangeOption,
    onPressRemove,
  } = props;

  const selectableIds = group.items.filter(item => item.availability.isPurchasable).map(item => item.cartId);
  const selectedCount = selectableIds.filter(id => selectedIds.has(id)).length;
  const isAllSelected = selectableIds.length > 0 && selectedCount === selectableIds.length;
  /** 일부만 골랐으면 중립 회색 — 로즈로 채우면 "이 공구는 다 골랐다"로 읽힌다 */
  const isPartiallySelected = selectedCount > 0 && !isAllSelected;

  return (
    <View className="bg-white">
      <View className="flex-row items-center px-14 pb-4 pt-14" style={{ gap: 10 }}>
        <Checkbox
          isChecked={isAllSelected}
          isPartial={isPartiallySelected}
          onChange={() => onToggleGroup(selectableIds, !isAllSelected)}
        />
        <Avatar imageUrl={group.marketImageUrl} size={26} />
        <Typography
          style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 17.55 }}
          className="min-w-0 flex-1 text-ink"
          numberOfLines={1}
        >
          {group.marketName}
        </Typography>
        {/*
          마감된 공구는 D-day를 "마감"으로 바꾸지 않고 아예 지운다(시안 C8) — D-day는 남은 시간을
          재촉하는 신호인데, 아래 상품 행이 이미 마감을 말하고 있어 같은 말을 두 번 하게 된다.
        */}
        {!group.isClosed && group.dDay !== null && group.dDay !== undefined && (
          <Typography style={{ fontSize: 12.5, fontWeight: "700", lineHeight: 12.5 }} className="text-rose">
            {`D-${group.dDay}`}
          </Typography>
        )}
      </View>

      {group.items.map(item => (
        <CartItemRow
          key={item.cartId}
          item={item}
          isSelected={selectedIds.has(item.cartId)}
          onToggleSelect={onToggleSelect}
          onChangeQuantity={onChangeQuantity}
          onPressChangeOption={onPressChangeOption}
          onPressRemove={onPressRemove}
        />
      ))}

      {/*
        시안 C8: 무료배송까지 남은 금액은 「배송비」 라벨 자리를 대신한다 — 한 줄에 라벨과 힌트를
        나눠 두면 어느 쪽이 금액 설명인지 흐려진다. 무료가 되면 값이 로즈 「무료배송」으로 바뀐다.
      */}
      <View className="flex-row items-baseline justify-between border-t-[0.5px] border-dividerProduct px-14 py-9">
        <Typography style={{ fontSize: 12.5, lineHeight: 17.5 }} className="text-gray45">
          {renderShippingLabel(group)}
        </Typography>
        <Typography
          style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 17.5 }}
          className={isFreeShippingApplied(group) ? "text-roseText" : "text-ink76"}
        >
          {renderShippingValue(group)}
        </Typography>
      </View>
    </View>
  );
}

function isFreeShippingApplied(group: CartGroup): boolean {
  return group.shipping.hasSelectedItems && group.shipping.isFreeShipping;
}

function renderShippingLabel(group: CartGroup): string {
  if (
    !group.shipping.hasSelectedItems ||
    group.shipping.isFreeShipping ||
    !group.shipping.amountToFreeShipping
  ) {
    return "배송비";
  }
  return `${formatPrice(group.shipping.amountToFreeShipping)}원 더 담으면 무료배송`;
}

function renderShippingValue(group: CartGroup): string {
  if (!group.shipping.hasSelectedItems) {
    return "—";
  }
  if (group.shipping.isFreeShipping) {
    return "무료배송";
  }
  return `${formatPrice(group.shipping.chargedDeliveryFee)}원`;
}
