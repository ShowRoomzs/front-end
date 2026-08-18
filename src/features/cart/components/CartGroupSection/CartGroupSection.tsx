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

  return (
    <View className="bg-white">
      <View className="flex-row items-center px-14 pb-4 pt-14" style={{ gap: 10 }}>
        <Checkbox isChecked={isAllSelected} onChange={() => onToggleGroup(selectableIds, !isAllSelected)} />
        <Avatar imageUrl={group.marketImageUrl} size={26} />
        <Typography
          style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 17.55 }}
          className="min-w-0 flex-1 text-ink"
          numberOfLines={1}
        >
          {group.marketName}
        </Typography>
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

      <View className="mx-14 flex-row items-center justify-between border-t-[0.5px] border-dividerProduct py-12">
        <Typography style={{ fontSize: 12.5, lineHeight: 18 }} className="text-gray45">
          배송비
        </Typography>
        <View className="items-end">
          <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 18 }} className="text-ink">
            {renderShippingValue(group)}
          </Typography>
          {!!group.shipping.amountToFreeShipping && (
            <Typography style={{ fontSize: 11, lineHeight: 16.5 }} className="text-gray45">
              {formatPrice(group.shipping.amountToFreeShipping)}원 더 담으면 무료
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
}

function renderShippingValue(group: CartGroup): string {
  if (!group.shipping.hasSelectedItems) {
    return "—";
  }
  if (group.shipping.isFreeShipping) {
    return "무료";
  }
  return `${formatPrice(group.shipping.chargedDeliveryFee)}원`;
}
