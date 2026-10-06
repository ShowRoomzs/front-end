import { BottomSheetView } from "@gorhom/bottom-sheet";
import { ReactNode, useCallback, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { CheckIcon, ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { useBottomSheet } from "@/common/hooks/useBottomSheet";
import { useBottomSheetContext } from "@/common/providers/BottomSheetProvider";
import {
  CARD_ISSUER_LABEL,
  CardIssuer,
  EASY_PAY_LABEL,
  EasyPayProvider,
  PaymentMethods,
  PaymentSelection,
} from "@/features/order/types/payment";

/**
 * 결제수단 — 2분할 카드 + 인라인 펼침(시안 C9 · C10-3 교환 · C10-5 반려 재발송).
 *
 * 라디오 점 목록을 쓰지 않고 **같은 크기의 카드 둘**로 나란히 놓는다. 선택지가 딱 두 개이고
 * 동등한 무게라 한 쌍으로 보이는 편이 "둘 중 하나"라는 구조를 그대로 드러낸다. 선택은 로즈
 * 테두리 1.5 + 틴트 배경(시트 선택 행과 같은 규칙).
 *
 * 고른 카드 아래에 세부가 펼쳐진다 — 카드는 카드사 시트, 간편결제는 3종 목록(선택 원 + 이름).
 * 브랜드 로고·색 칩을 쓰지 않는다: 상표 사용 승인이 필요하고, 세 색이 나란히 놓이면 로즈 선택
 * 신호가 묻힌다. 할부·카드번호는 받지 않는다(일시불 고정 · 결제창에서 입력).
 *
 * 그릴 목록은 서버의 `paymentMethods`를 따른다 — 빈 배열이면 그 수단 자체를 숨긴다.
 *
 * 카드사 시트는 두 모양이다 — C9는 세로 목록(`list`), 반품·교환 화면은 3열 격자(`grid`).
 */
interface PaymentMethodPickerProps {
  /** 시트 등록 id — 한 화면에 피커가 둘이면 서로 달라야 한다 */
  sheetId: string;
  methods: PaymentMethods | null | undefined;
  value: Partial<PaymentSelection>;
  onChange: (next: Partial<PaymentSelection>) => void;
  issuerSheet?: "list" | "grid";
  /** 간편결제 행 라벨 크기 — C9 14 · 반품·교환 14.5 */
  easyPayLabelSize?: number;
}

const ROSE = "#F2456E";

export default function PaymentMethodPicker(props: PaymentMethodPickerProps) {
  const { sheetId, methods, value, onChange, issuerSheet = "list", easyPayLabelSize = 14 } = props;
  const { close } = useBottomSheetContext();

  const cardIssuers = useMemo(() => methods?.cardIssuers ?? [], [methods?.cardIssuers]);
  const easyPays = methods?.easyPayProviders ?? [];
  const hasCard = cardIssuers.length > 0;
  const hasEasy = easyPays.length > 0;

  const isCard = value.method === "CARD";
  const isEasy = value.method === "EASY_PAY";

  const handlePickIssuer = useCallback(
    (issuer: CardIssuer) => {
      onChange({ method: "CARD", cardIssuer: issuer });
      close();
    },
    [close, onChange]
  );

  const { open: openIssuerSheet } = useBottomSheet({
    id: sheetId,
    render: (
      <IssuerSheet
        variant={issuerSheet}
        issuers={cardIssuers}
        selected={value.cardIssuer}
        onPick={handlePickIssuer}
      />
    ),
    sheetProps: { enableDynamicSizing: true, snapPoints: undefined },
  });

  return (
    <View>
      <View className="flex-row px-14 pt-12" style={{ gap: 8 }}>
        {hasCard && (
          <MethodTile
            label="신용 · 체크카드"
            isSelected={isCard}
            icon={color => (
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={6} width={18} height={12.5} rx={2.4} stroke={color} strokeWidth={1.6} />
                <Path d="M3 10.2h18" stroke={color} strokeWidth={1.6} />
                <Path d="M6.4 14.6h3.4" stroke={color} strokeWidth={1.6} />
              </Svg>
            )}
            onPress={() => !isCard && onChange({ method: "CARD" })}
          />
        )}
        {hasEasy && (
          <MethodTile
            label="간편결제"
            isSelected={isEasy}
            icon={color => (
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Rect x={6} y={3} width={12} height={18} rx={2.6} stroke={color} strokeWidth={1.6} />
                <Path d="M10.3 6.6h3.4" stroke={color} strokeWidth={1.6} />
                <Circle cx={12} cy={16.4} r={1.9} stroke={color} strokeWidth={1.6} />
              </Svg>
            )}
            onPress={() => !isEasy && onChange({ method: "EASY_PAY" })}
          />
        )}
      </View>

      {isCard && (
        <View className="px-14 pt-10">
          <TouchableOpacity
            onPress={openIssuerSheet}
            activeOpacity={0.6}
            className="h-48 flex-row items-center justify-between rounded-base border-[1px] border-borderButton bg-white px-13"
          >
            <Typography
              style={{ fontSize: 14.5, lineHeight: 14.5 }}
              className={value.cardIssuer ? "text-ink" : "text-gray71"}
            >
              {value.cardIssuer ? `${CARD_ISSUER_LABEL[value.cardIssuer]}카드` : "카드사를 선택해 주세요"}
            </Typography>
            <ChevronDownIcon size={14} color="#C7C7C7" />
          </TouchableOpacity>
        </View>
      )}

      {isEasy && (
        <View className="px-14 pt-10" style={{ gap: 7 }}>
          {easyPays.map(provider => (
            <EasyPayRow
              key={provider}
              provider={provider}
              labelSize={easyPayLabelSize}
              isSelected={value.easyPayProvider === provider}
              onPress={() => onChange({ method: "EASY_PAY", easyPayProvider: provider })}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function MethodTile(props: {
  label: string;
  isSelected: boolean;
  icon: (color: string) => ReactNode;
  onPress: () => void;
}) {
  const { label, isSelected, icon, onPress } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className="min-w-0 flex-1 items-center justify-center rounded-base"
      style={{
        height: 74,
        gap: 9,
        borderWidth: isSelected ? 1.5 : 1,
        borderColor: isSelected ? ROSE : "#E3E3E5",
        backgroundColor: isSelected ? "#FEF4F6" : "#FFFFFF",
      }}
    >
      {icon(isSelected ? ROSE : "#8E8E8E")}
      <Typography
        style={{ fontSize: 13.5, fontWeight: isSelected ? "600" : "400", lineHeight: 13.5 }}
        className={isSelected ? "text-roseText" : "text-ink76"}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
}

/** 선택 원 + 이름 — 로즈 원 20 · 안쪽 흰 점 7 */
export function RadioDot(props: { isSelected: boolean }) {
  const { isSelected } = props;

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: isSelected ? ROSE : "#DEDEE0",
        backgroundColor: isSelected ? ROSE : "#FFFFFF",
      }}
    >
      <View
        className="rounded-full"
        style={{ width: 7, height: 7, backgroundColor: isSelected ? "#FFFFFF" : "transparent" }}
      />
    </View>
  );
}

function EasyPayRow(props: {
  provider: EasyPayProvider;
  labelSize: number;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { provider, labelSize, isSelected, onPress } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className="flex-row items-center rounded-base px-13"
      style={{
        minHeight: 52,
        gap: 11,
        borderWidth: 1,
        borderColor: isSelected ? ROSE : "#E3E3E5",
        backgroundColor: isSelected ? "#FEF4F6" : "#FFFFFF",
      }}
    >
      <RadioDot isSelected={isSelected} />
      <Typography
        style={{ fontSize: labelSize, fontWeight: isSelected ? "600" : "400", lineHeight: labelSize * 1.35 }}
        className={`min-w-0 flex-1 ${isSelected ? "text-ink" : "text-ink76"}`}
      >
        {EASY_PAY_LABEL[provider]}
      </Typography>
    </TouchableOpacity>
  );
}

function IssuerSheet(props: {
  variant: "list" | "grid";
  issuers: Array<CardIssuer>;
  selected?: CardIssuer;
  onPick: (issuer: CardIssuer) => void;
}) {
  const { variant, issuers, selected, onPick } = props;
  const { bottom } = useSafeAreaInsets();

  return (
    <BottomSheetView style={{ paddingBottom: Math.max(bottom, variant === "grid" ? 24 : 20) }}>
      <Typography
        style={{ fontSize: 15, fontWeight: "600", lineHeight: 21 }}
        className="px-20 pb-12 text-center text-ink"
      >
        카드사 선택
      </Typography>

      {variant === "grid" ? (
        <View className="flex-row flex-wrap px-20" style={{ gap: 7 }}>
          {issuers.map(issuer => {
            const isSelected = issuer === selected;

            return (
              <TouchableOpacity
                key={issuer}
                onPress={() => onPick(issuer)}
                activeOpacity={0.6}
                className="items-center justify-center rounded-base"
                style={{
                  // 3열 — 좌우 20 · 사이 7×2
                  width: "31.5%",
                  height: 46,
                  borderWidth: isSelected ? 1.5 : 1,
                  borderColor: isSelected ? ROSE : "#E3E3E5",
                  backgroundColor: isSelected ? "#FEF4F6" : "#FFFFFF",
                }}
              >
                <Typography
                  style={{ fontSize: 13.5, fontWeight: isSelected ? "600" : "400", lineHeight: 13.5 }}
                  className={isSelected ? "text-roseText" : "text-ink76"}
                >
                  {CARD_ISSUER_LABEL[issuer]}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        issuers.map((issuer, ix) => {
          const isSelected = issuer === selected;

          return (
            <TouchableOpacity
              key={issuer}
              onPress={() => onPick(issuer)}
              activeOpacity={0.6}
              className="flex-row items-center justify-between px-20"
              style={{
                minHeight: 44,
                paddingVertical: 13,
                gap: 12,
                backgroundColor: isSelected ? "#FEF4F6" : "#FFFFFF",
                ...(ix > 0 ? { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" } : null),
              }}
            >
              <Typography
                style={{ fontSize: 14.5, fontWeight: isSelected ? "600" : "400", lineHeight: 19.6 }}
                className={isSelected ? "text-ink" : "text-ink76"}
              >
                {`${CARD_ISSUER_LABEL[issuer]}카드`}
              </Typography>
              {isSelected && <CheckIcon size={18} />}
            </TouchableOpacity>
          );
        })
      )}
    </BottomSheetView>
  );
}
