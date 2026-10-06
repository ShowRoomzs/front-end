import { ReactNode } from "react";
import { Image, Pressable, StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";

/**
 * 주문 화면(C9 · C10 · C10-1~5) 공용 부품.
 *
 * 시안이 같은 문법을 반복한다 — 5px 밴드로 섹션을 끊고, 섹션 제목은 15/700 · -0.2, 상품 행은
 * 썸네일 64 + 브랜드 11.5 회색 + 상품명 13.5 + 옵션·금액 줄, 하단 고정 CTA는 52px R8.
 * 화면마다 따로 그리면 수치가 조금씩 갈리므로 여기 한 곳에 둔다.
 */

/** 섹션 사이 5px 회색 밴드 */
export function Band(props: { marginTop?: number }) {
  return <View className="bg-band" style={{ height: 5, marginTop: props.marginTop }} />;
}

/** 섹션 제목 — 15/700 · -0.2, 개수는 같은 굵기의 회색(「주문 상품 2」) */
export function SectionTitle(props: {
  title: string;
  count?: string | number;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { title, count, right, style } = props;

  return (
    <View className="flex-row items-baseline px-14" style={[{ paddingTop: 18, gap: 7 }, style]}>
      <Typography
        style={{ fontSize: 15, fontWeight: "700", lineHeight: 15, letterSpacing: -0.2 }}
        className="text-ink"
      >
        {title}
      </Typography>
      {count !== undefined && (
        <Typography style={{ fontSize: 15, fontWeight: "700", lineHeight: 15 }} className="text-gray45">
          {count}
        </Typography>
      )}
      {!!right && (
        <>
          <View className="flex-1" />
          {right}
        </>
      )}
    </View>
  );
}

/** 상품 썸네일 — R4. 이미지가 없으면 밴드 색으로 자리만 둔다 */
export function Thumb(props: { uri?: string | null; size?: number; dimmed?: boolean }) {
  const { uri, size = 64, dimmed } = props;

  return (
    <View
      className="overflow-hidden bg-band"
      style={{ width: size, height: size, borderRadius: 4, opacity: dimmed ? 0.55 : 1 }}
    >
      {!!uri && <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="cover" />}
    </View>
  );
}

/**
 * 상품 한 줄 — 썸네일 64 · 브랜드(11.5 #737373) · 상품명(13.5 한 줄) · 옵션(12)과 금액(14/700).
 * 탈색(`dimmed`)이면 썸네일 불투명도와 상품명·금액 색을 낮춘다(취소·반품 행).
 */
export function ProductLine(props: {
  thumbnailUrl?: string | null;
  brand?: string | null;
  name: string;
  option?: string;
  price?: string;
  dimmed?: boolean;
  /** 금액 글자 — 탈색 행은 400으로 낮춘다 */
  priceWeight?: "400" | "700";
}) {
  const { thumbnailUrl, brand, name, option, price, dimmed, priceWeight = "700" } = props;

  return (
    <View className="flex-row" style={{ gap: 12 }}>
      <Thumb uri={thumbnailUrl} dimmed={dimmed} />
      <View className="min-w-0 flex-1">
        {!!brand && (
          <Typography style={{ fontSize: 11.5, lineHeight: 15.5 }} className="text-gray45">
            {brand}
          </Typography>
        )}
        <Typography
          style={{ fontSize: 13.5, lineHeight: 19.6, marginTop: 3 }}
          className={dimmed ? "text-gray62" : "text-ink80"}
          numberOfLines={1}
        >
          {name}
        </Typography>
        <View className="flex-row items-baseline justify-between" style={{ marginTop: 6, gap: 10 }}>
          <Typography
            style={{ fontSize: 12, lineHeight: 16.8 }}
            className="min-w-0 flex-1 text-gray45"
            numberOfLines={1}
          >
            {option ?? ""}
          </Typography>
          {!!price && (
            <Typography
              style={{ fontSize: 14, fontWeight: priceWeight, lineHeight: 14, letterSpacing: -0.2 }}
              className={dimmed ? "text-gray62" : "text-ink"}
            >
              {price}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
}

/**
 * 상품 블록(반품·교환 상세 · 취소 완료) — 썸네일 72 · 브랜드 12/600 · 이름 · 옵션 · 금액이 세로로 쌓인다.
 * 교환은 받은 옵션(취소선) → 새 옵션 두 줄이다.
 */
export function ProductBlock(props: {
  thumbnailUrl?: string | null;
  brand?: string | null;
  name: string;
  meta?: string;
  /** 교환 — 받은 옵션을 취소선으로, 이 줄을 아래에 잉크로 */
  newMeta?: string | null;
  price?: string;
}) {
  const { thumbnailUrl, brand, name, meta, newMeta, price } = props;

  return (
    <View className="flex-row items-center" style={{ gap: 12 }}>
      <Thumb uri={thumbnailUrl} size={72} />
      <View className="min-w-0 flex-1">
        {!!brand && (
          <Typography style={{ fontSize: 12, fontWeight: "600", lineHeight: 15.6 }} className="text-ink76">
            {brand}
          </Typography>
        )}
        <Typography
          style={{ fontSize: 13.5, lineHeight: 18.9, marginTop: 3 }}
          className="text-ink80"
          numberOfLines={1}
        >
          {name}
        </Typography>
        {!!meta && (
          <Typography
            style={{
              fontSize: 12,
              lineHeight: 16.8,
              marginTop: 3,
              textDecorationLine: newMeta ? "line-through" : "none",
            }}
            className={newMeta ? "text-gray62" : "text-gray45"}
          >
            {meta}
          </Typography>
        )}
        {!!newMeta && (
          <Typography style={{ fontSize: 12, lineHeight: 16.8, marginTop: 2 }} className="text-ink">
            {newMeta}
          </Typography>
        )}
        {!!price && (
          <Typography
            style={{ fontSize: 14, fontWeight: "700", lineHeight: 14, letterSpacing: -0.2, marginTop: 5 }}
            className="text-ink"
          >
            {price}
          </Typography>
        )}
      </View>
    </View>
  );
}

/** 라벨 열 고정 정보 행 — 신청 정보 · 택배사/송장 · 발송 예정 */
export function InfoRow(props: {
  label: string;
  value?: ReactNode;
  labelWidth?: number;
  valueColor?: string;
  fontSize?: number;
  align?: "left" | "right";
  children?: ReactNode;
}) {
  const {
    label,
    value,
    labelWidth = 76,
    valueColor = "#0F0F0F",
    fontSize = 13.5,
    align = "left",
    children,
  } = props;

  return (
    <View className="flex-row" style={{ gap: 14, paddingVertical: 6 }}>
      <Typography style={{ width: labelWidth, fontSize, lineHeight: fontSize * 1.5 }} className="text-gray45">
        {label}
      </Typography>
      <View className="min-w-0 flex-1">
        {value !== undefined && (
          <Typography style={{ fontSize, lineHeight: fontSize * 1.5, color: valueColor, textAlign: align }}>
            {value}
          </Typography>
        )}
        {children}
      </View>
    </View>
  );
}

/** 금액 줄 — 라벨 좌 · 값 우. 「배송비 3,000원」 */
export function AmountRow(props: {
  label: string;
  value: string;
  valueColor?: string;
  valueWeight?: "400" | "500" | "600";
  labelColor?: string;
  fontSize?: number;
  strike?: boolean;
}) {
  const {
    label,
    value,
    valueColor = "#0F0F0F",
    valueWeight = "400",
    labelColor = "#737373",
    fontSize = 13,
    strike,
  } = props;

  return (
    <View className="flex-row items-baseline justify-between" style={{ gap: 12 }}>
      <Typography style={{ fontSize, lineHeight: fontSize * 1.5, color: labelColor }}>{label}</Typography>
      <Typography
        style={{
          fontSize: fontSize + 0.5,
          fontWeight: valueWeight,
          lineHeight: (fontSize + 0.5) * 1.5,
          color: valueColor,
          textAlign: "right",
          flexShrink: 1,
          textDecorationLine: strike ? "line-through" : "none",
        }}
      >
        {value}
      </Typography>
    </View>
  );
}

/** 합계 줄 — 0.5px 위 구분선 + 라벨 14.5/700 · 금액 17/700 */
export function TotalRow(props: { label: string; value: string; valueColor?: string; prefix?: ReactNode }) {
  const { label, value, valueColor = "#0F0F0F", prefix } = props;

  return (
    <View
      className="mx-14 flex-row items-baseline justify-between border-t-[0.5px] border-dividerProduct"
      style={{ marginTop: 13, paddingTop: 13, gap: 12 }}
    >
      <Typography style={{ fontSize: 14.5, fontWeight: "700", lineHeight: 14.5 }} className="text-ink">
        {label}
      </Typography>
      <View className="flex-row items-baseline" style={{ gap: 7 }}>
        {prefix}
        <Typography
          style={{ fontSize: 17, fontWeight: "700", lineHeight: 17, letterSpacing: -0.4, color: valueColor }}
        >
          {value}
        </Typography>
      </View>
    </View>
  );
}

/** 「•」 안내 목록 — 12/1.65 #737373 */
export function BulletNotes(props: {
  notes: Array<ReactNode>;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { notes, fontSize = 12, style } = props;

  return (
    <View style={[{ gap: 7 }, style]}>
      {notes.map((note, ix) => (
        <View key={ix} className="flex-row" style={{ gap: 7 }}>
          <Typography style={{ fontSize, lineHeight: fontSize * 1.65 }} className="text-gray45">
            •
          </Typography>
          <Typography
            style={{ fontSize, lineHeight: fontSize * 1.65 }}
            className="min-w-0 flex-1 text-gray45"
          >
            {note}
          </Typography>
        </View>
      ))}
    </View>
  );
}

/** 외곽선 버튼 — 항목 행의 [배송 조회] · [반품 상세] 등. 로즈 채움은 목록에 두지 않는다 */
export function OutlineAction(props: {
  label: string;
  onPress?: () => void;
  height?: number;
  fontSize?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { label, onPress, height = 40, fontSize = 12.5, disabled, style } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.55}
      className="min-w-0 flex-1 flex-row items-center justify-center rounded-base bg-white"
      style={[{ height, borderWidth: 1, borderColor: disabled ? "#F4F4F5" : "#E3E3E5" }, style]}
    >
      <Typography
        style={{ fontSize, fontWeight: "600", lineHeight: fontSize }}
        className={disabled ? "text-gray62" : "text-ink76"}
        numberOfLines={1}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
}

/** 작은 외곽선 버튼 — [변경] · [주소 복사] (높이 30 · 11.5/600) */
export function SmallOutlineButton(props: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.55}
      style={{ paddingVertical: 7, marginVertical: -7 }}
    >
      <View className="h-30 flex-row items-center rounded-base border-[1px] border-borderButton bg-white px-11">
        <Typography style={{ fontSize: 11.5, fontWeight: "600", lineHeight: 11.5 }} className="text-ink76">
          {props.label}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}

/** 밑줄 텍스트 링크 — [주문 상세] · [배송지 변경] (12.5/500 #737373) */
export function UnderlineLink(props: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.55}
      style={{ paddingVertical: 12, marginVertical: -12 }}
    >
      <Typography
        style={{ fontSize: 12.5, fontWeight: "500", lineHeight: 17.5, textDecorationLine: "underline" }}
        className="text-gray45"
      >
        {props.label}
      </Typography>
    </TouchableOpacity>
  );
}

/**
 * 하단 고정 CTA — 52px R8. 막혔으면 회색(#F4F4F5 · #B5B5B5)이고 **라벨이 막힌 이유를 말한다**
 * (「결제수단을 선택해 주세요」) — 비활성 버튼만 두면 왜 안 눌리는지 찾아 헤매게 된다.
 */
export function BottomCta(props: {
  label: string;
  enabled: boolean;
  onPress: () => void;
  top?: ReactNode;
  loading?: boolean;
}) {
  const { label, enabled, onPress, top, loading } = props;
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="border-t-[0.5px] border-divider bg-white px-14 pt-12"
      style={{ paddingBottom: bottom + 26 }}
    >
      {top}
      <TouchableOpacity
        onPress={onPress}
        disabled={!enabled || loading}
        activeOpacity={0.75}
        className={`h-52 flex-row items-center justify-center rounded-base ${enabled ? "bg-rose" : "bg-fill"}`}
        style={{ opacity: loading ? 0.75 : 1 }}
      >
        <Typography variant="buttonPrimary" className={enabled ? "text-white" : "text-gray71"}>
          {label}
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

/** 둥근 체크 21 — 결제 동의 · 전체 선택 · 장바구니 다시 담기 */
export function RoundCheck(props: { isChecked: boolean; disabled?: boolean }) {
  const { isChecked, disabled } = props;
  const on = isChecked && !disabled;

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: 21,
        height: 21,
        borderWidth: 1.5,
        borderColor: on ? "#F2456E" : "#DEDEE0",
        backgroundColor: on ? "#F2456E" : "#FFFFFF",
      }}
    >
      <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4.5 12.5l5 5 10-11"
          stroke={on ? "#FFFFFF" : "#DEDEE0"}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

/** 네모 체크 19 — 「나중에 입력하기」 */
export function SquareCheck(props: { isChecked: boolean }) {
  const { isChecked } = props;

  return (
    <View
      className="items-center justify-center"
      style={{
        width: 19,
        height: 19,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: isChecked ? "#F2456E" : "#DEDEE0",
        backgroundColor: isChecked ? "#F2456E" : "#FFFFFF",
      }}
    >
      <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4.5 12.5l5 5 10-11"
          stroke={isChecked ? "#FFFFFF" : "transparent"}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

/** 회색 안내 박스 — 아이콘 ⓘ + 본문 12.5/1.6. `tone="rose"`면 로즈 틴트(기한이 있는 안내) */
export function NoticeBox(props: {
  children: ReactNode;
  tone?: "gray" | "rose";
  style?: StyleProp<ViewStyle>;
}) {
  const { children, tone = "gray", style } = props;
  const isRose = tone === "rose";
  const stroke = isRose ? "#CF3D61" : "#3C3C3C";

  return (
    <View
      className={`mx-14 flex-row items-start rounded-base p-13 ${isRose ? "bg-roseTint" : "bg-band"}`}
      style={[{ gap: 9 }, style]}
    >
      <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" style={{ marginTop: 1 }}>
        <Path d="M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z" stroke={stroke} strokeWidth={1.5} />
        <Path d="M12 7.6v5.2" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
        <Path d="M12 16.3v.2" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
      </Svg>
      <View className="min-w-0 flex-1">{children}</View>
    </View>
  );
}

/** 「유의해 주세요」 로즈 틴트 박스 — 반품·교환 방법 · 상세 */
export function CautionBox(props: { title?: string; lines: Array<ReactNode>; style?: StyleProp<ViewStyle> }) {
  const { title = "유의해 주세요", lines, style } = props;

  return (
    <View className="mx-14 rounded-base bg-roseTint px-14 py-13" style={style}>
      <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-roseText">
        {title}
      </Typography>
      <View style={{ marginTop: 9, gap: 4 }}>
        {lines.map((line, ix) => (
          <View key={ix} className="flex-row" style={{ gap: 7 }}>
            <Typography style={{ fontSize: 12.5, lineHeight: 20.6 }} className="text-ink76">
              •
            </Typography>
            <Typography style={{ fontSize: 12.5, lineHeight: 20.6 }} className="min-w-0 flex-1 text-ink76">
              {line}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
}

/** 복사 아이콘 버튼 — 주문번호 · 송장번호 */
export function CopyButton(props: { onPress: () => void; size?: number }) {
  const { onPress, size = 13 } = props;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={15}
      style={({ pressed }) => ({ opacity: pressed ? 0.4 : 1, marginLeft: 6 })}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x={8.5} y={8.5} width={11} height={11} stroke="#C7C7C7" strokeWidth={1.8} />
        <Path d="M15.5 5.5h-11v11" stroke="#C7C7C7" strokeWidth={1.8} />
      </Svg>
    </Pressable>
  );
}

/** 우측 셰브런이 붙은 한 줄 링크 — 할 일(로즈) · 반려 사유 보기(회색) */
export function ChevronLine(props: {
  label: string;
  tone: "rose" | "gray";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { label, tone, onPress, style } = props;
  const isRose = tone === "rose";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.55}
      className="flex-row items-center"
      style={[{ gap: 3, paddingVertical: 6 }, style]}
    >
      <Typography
        style={{ fontSize: 12, fontWeight: isRose ? "600" : "400", lineHeight: 15.6 }}
        className={isRose ? "text-roseText" : "text-gray45"}
      >
        {label}
      </Typography>
      {!!onPress && (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 5l7 7-7 7"
            stroke={isRose ? "#F2456E" : "#C7C7C7"}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </TouchableOpacity>
  );
}

/**
 * 닫기(X) 헤더 — 접수 · 완료 화면과 송장 등록처럼 **끝난 흐름 위에 덮이는 화면**.
 * 뒤로가기를 두면 방금 끝난 폼으로 돌아가게 되므로 우상단 X로 닫는다.
 */
export function CloseHeader(props: { title: string; onClose: () => void }) {
  const { title, onClose } = props;

  return (
    <View className="border-b-[0.5px] border-divider bg-white">
      <View className="h-46 flex-row items-center justify-between pl-16 pr-4">
        <Typography
          style={{ fontSize: 16, fontWeight: "600", lineHeight: 16, letterSpacing: -0.3 }}
          className="text-ink"
        >
          {title}
        </Typography>
        <TouchableOpacity onPress={onClose} activeOpacity={0.4} className="p-11">
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M6 6l12 12" stroke="#0F0F0F" strokeWidth={1.8} strokeLinecap="round" />
            <Path d="M18 6L6 18" stroke="#0F0F0F" strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/** 폼 입력 라벨 — 600 13 #3C3C3C */
export function FieldTitle(props: { label: string; suffix?: ReactNode; right?: ReactNode }) {
  const { label, suffix, right } = props;

  return (
    <View className="flex-row items-baseline justify-between">
      <Typography style={{ fontSize: 13, fontWeight: "600", lineHeight: 13 }} className="text-ink76">
        {label}
        {suffix}
      </Typography>
      {right}
    </View>
  );
}

/** 드롭다운 칸 — 48 · R8 · 셰브런 14. 잠겼으면 회색 배경(나중에 입력하기) */
export function SelectField(props: {
  value: string | null | undefined;
  placeholder: string;
  onPress: () => void;
  locked?: boolean;
  height?: number;
  fontSize?: number;
}) {
  const { value, placeholder, onPress, locked, height = 48, fontSize = 14.5 } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.6}
      className="flex-row items-center justify-between rounded-base border-[1px] border-borderButton px-13"
      style={{ height, gap: 10, backgroundColor: locked ? "#F7F7F8" : "#FFFFFF" }}
    >
      <Typography
        style={{ fontSize, lineHeight: fontSize, flexShrink: 1 }}
        className={selectFieldColor(locked, !!value)}
        numberOfLines={1}
      >
        {value || placeholder}
      </Typography>
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path
          d="M5 9l7 7 7-7"
          stroke="#C7C7C7"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

function selectFieldColor(locked: boolean | undefined, hasValue: boolean) {
  if (locked) {
    return "text-gray7";
  }
  return hasValue ? "text-ink" : "text-gray71";
}
