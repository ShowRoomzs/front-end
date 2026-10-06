import { BottomSheetView } from "@gorhom/bottom-sheet";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CheckIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { ClaimFormCarrier, DeliveryCarrierCode } from "@/features/order/types/claim";

/** 택배사 선택 시트 — 항목 16/20 · 라벨 15(선택 600) · 체크 로즈 19(시안 C10-3 · C10-5) */
export default function CarrierSheet(props: {
  carriers: Array<ClaimFormCarrier>;
  selected: DeliveryCarrierCode | null;
  onPick: (code: DeliveryCarrierCode) => void;
}) {
  const { carriers, selected, onPick } = props;
  const { bottom } = useSafeAreaInsets();

  return (
    <BottomSheetView style={{ paddingBottom: Math.max(bottom, 24) }}>
      <Typography
        style={{ fontSize: 15, fontWeight: "600", lineHeight: 21 }}
        className="px-20 pb-12 text-center text-ink"
      >
        택배사 선택
      </Typography>
      {carriers.map((carrier, ix) => {
        const isSelected = carrier.code === selected;

        return (
          <TouchableOpacity
            key={carrier.code}
            onPress={() => onPick(carrier.code)}
            activeOpacity={0.6}
            className="flex-row items-center justify-between px-20"
            style={{
              paddingVertical: 16,
              gap: 12,
              ...(ix > 0 ? { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } : null),
            }}
          >
            <Typography
              style={{ fontSize: 15, fontWeight: isSelected ? "600" : "400", lineHeight: 20.25 }}
              className={isSelected ? "text-ink" : "text-ink76"}
            >
              {carrier.label}
            </Typography>
            {isSelected && <CheckIcon size={19} />}
          </TouchableOpacity>
        );
      })}
    </BottomSheetView>
  );
}
