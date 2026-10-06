import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Typography from "@/common/components/Typography/Typography";
import { ClaimExchangeOption } from "@/features/order/types/claim";

/**
 * 교환할 옵션 시트 — C7 옵션 시트와 같은 규격(묶인 목록 · 품절 회색 + 「품절」 텍스트).
 *
 * **지금 받은 옵션도 고를 수 있다**(「받은 옵션 · 같은 옵션으로 다시 받기」) — 파손·불량·오배송이면
 * 같은 상품을 새로 받아야 하기 때문이다. 고른 뒤 [변경하기]를 눌러야 반영돼, 목록을 스크롤하다
 * 잘못 누른 것이 바로 적용되지 않는다. 목록은 받은 옵션과 **같은 가격**인 옵션뿐이다(서버가 거른다).
 */
interface ExchangeOptionSheetProps {
  productName: string;
  options: Array<ClaimExchangeOption>;
  selected: number | null;
  onApply: (variantId: number) => void;
  onCancel: () => void;
}

export default function ExchangeOptionSheet(props: ExchangeOptionSheetProps) {
  const { productName, options, selected, onApply, onCancel } = props;
  const { bottom } = useSafeAreaInsets();
  const [temp, setTemp] = useState<number | null>(selected);

  useEffect(() => {
    setTemp(selected);
  }, [selected, productName]);

  const canApply = temp !== null;

  return (
    <BottomSheetView style={{ paddingBottom: Math.max(bottom, 26) }}>
      <Typography
        style={{ fontSize: 15, fontWeight: "600", lineHeight: 21 }}
        className="px-20 pb-4 text-center text-ink"
      >
        교환할 옵션
      </Typography>
      <Typography
        style={{ fontSize: 12, lineHeight: 18 }}
        className="px-20 pb-12 text-center text-gray45"
        numberOfLines={1}
      >
        {productName}
      </Typography>

      <View className="mx-20 overflow-hidden rounded-base border-[1px] border-borderButton">
        {options.map((option, ix) => {
          const isSelected = temp === option.variantId;

          let tag = "";
          let labelColor = isSelected ? "text-ink" : "text-ink76";

          if (option.current) {
            tag = "받은 옵션 · 같은 옵션으로 다시 받기";
          } else if (option.soldOut) {
            tag = "품절";
          }
          if (option.soldOut) {
            labelColor = "text-gray62";
          }

          return (
            <TouchableOpacity
              key={option.variantId}
              onPress={() => !option.soldOut && setTemp(option.variantId)}
              disabled={option.soldOut}
              activeOpacity={0.6}
              className="flex-row items-center px-13"
              style={{
                minHeight: 44,
                paddingVertical: 8,
                gap: 10,
                backgroundColor: isSelected ? "#FEF4F6" : "#FFFFFF",
                ...(ix > 0 ? { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } : null),
              }}
            >
              <Typography
                style={{ fontSize: 14, fontWeight: isSelected ? "600" : "400", lineHeight: 18.9 }}
                className={`min-w-0 flex-1 ${labelColor}`}
              >
                {option.optionName}
              </Typography>
              {!!tag && (
                <Typography
                  style={{ fontSize: 12, fontWeight: "600", lineHeight: 15.6 }}
                  className="text-gray62"
                >
                  {tag}
                </Typography>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row px-20 pt-18" style={{ gap: 8 }}>
        <TouchableOpacity
          onPress={onCancel}
          activeOpacity={0.6}
          className="h-52 flex-1 items-center justify-center rounded-base border-[1px] border-borderButton bg-white"
        >
          <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }} className="text-ink76">
            취소
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => temp !== null && onApply(temp)}
          disabled={!canApply}
          activeOpacity={0.75}
          className={`h-52 flex-1 items-center justify-center rounded-base ${canApply ? "bg-rose" : "bg-fill"}`}
        >
          <Typography
            style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }}
            className={canApply ? "text-white" : "text-gray71"}
          >
            변경하기
          </Typography>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
}
