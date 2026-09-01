import { TouchableOpacity, View } from "react-native";

import { CloseIcon } from "@/common/components/DsIcon/icons";
import Stepper from "@/common/components/Stepper/Stepper";
import Typography from "@/common/components/Typography/Typography";
import { formatPrice } from "@/common/utils/formatPrice";
import { VARIANT_CARD_MIN_COUNT } from "@/features/product/components/VariantCard/config";
import { LocalVariant } from "@/features/product/types/product";

/**
 * 옵션 시트에 쌓이는 **선택 줄** (시안 C7).
 *
 * 테두리를 두르지 않고 회색 면(#F7F7F8)만으로 묶는다 — 위의 드롭다운이 이미 1px 테두리를
 * 쓰고 있어, 같은 시트 안에서 선을 한 겹 더 그으면 무엇이 고르는 칸이고 무엇이 고른 결과인지
 * 형태로 구분되지 않는다.
 *
 * 같은 상품의 다른 조합을 **여러 줄 담을 수 있다.** 같은 조합을 다시 고르면 새 줄이 아니라
 * 수량이 +1 된다(줄이 늘어나면 합계가 어디서 왔는지 읽기 어려워진다).
 */
interface VariantCardProps {
  variant: LocalVariant;
  /**
   * 옵션이 없는 상품은 이 줄이 **지울 수 없는 유일한 줄**이다 — 지우고 나면 시트에 아무것도
   * 남지 않아 무엇을 사려던 화면인지 사라진다(시안 `ln.canRemove`).
   */
  canRemove?: boolean;
  onRemove: () => void;
  onChangeCount: (count: number) => void;
}

export default function VariantCard(props: VariantCardProps) {
  const { variant, canRemove = true, onRemove, onChangeCount } = props;

  const totalPrice = variant.salePrice * variant.count;

  return (
    <View className="rounded-base bg-band" style={{ padding: 13 }}>
      <View className="flex-row items-start" style={{ gap: 10 }}>
        <Typography
          style={{ fontSize: 13, fontWeight: "500", lineHeight: 18.85 }}
          className="min-w-0 flex-1 text-ink76"
        >
          {variant.name}
        </Typography>

        {canRemove && (
          <TouchableOpacity
            onPress={onRemove}
            activeOpacity={0.4}
            className="items-center justify-center"
            style={{ width: 24, height: 24, marginTop: -4, marginRight: -4 }}
          >
            <CloseIcon size={13} color="#8E8E8E" />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row items-center justify-between" style={{ gap: 12, marginTop: 11 }}>
        <Stepper
          size="md"
          min={VARIANT_CARD_MIN_COUNT}
          max={variant.stock}
          value={variant.count}
          onChange={onChangeCount}
        />

        <Typography
          style={{ fontSize: 16, fontWeight: "600", lineHeight: 16, letterSpacing: -0.3 }}
          className="text-ink"
        >
          {`${formatPrice(totalPrice)}원`}
        </Typography>
      </View>
    </View>
  );
}
