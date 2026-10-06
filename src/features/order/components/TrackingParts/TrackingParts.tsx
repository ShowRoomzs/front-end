import { useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { ChevronDownIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { CopyButton } from "@/features/order/components/OrderParts/OrderParts";
import { TrackingCarrier } from "@/features/order/types/order";
import { copyToClipboard } from "@/features/order/utils/copyToClipboard";

/**
 * 배송 조회(C10-2)와 회수 조회(C10-4)가 같은 틀을 쓴다 — 결론 제목 · 단계 바 · 송장 · 이력.
 */

/**
 * 단계 바 — 택배사 스캔을 사용자 언어로 접은 것이다. 지난 칸은 잉크, 지금 칸은 로즈, 남은 칸은 회색.
 * `current`가 -1이면 전부 비운다(아직 시작 전).
 */
export function StageBar(props: { labels: Array<string>; current: number; labelSize?: number }) {
  const { labels, current, labelSize = 12.5 } = props;

  return (
    <View className="flex-row px-14 pt-18" style={{ gap: 6 }}>
      {labels.map((label, ix) => {
        const isCurrent = ix === current;
        const isPast = ix < current;
        const tone = stageTone(isPast, isCurrent);

        return (
          <View key={`${label}-${ix}`} className="min-w-0 flex-1">
            <View
              style={{
                height: 3,
                borderRadius: 2,
                backgroundColor: tone.bar,
              }}
            />
            <Typography
              style={{
                fontSize: labelSize,
                fontWeight: isCurrent ? "600" : "400",
                lineHeight: labelSize * 1.35,
                marginTop: 9,
                color: tone.label,
              }}
            >
              {label}
            </Typography>
          </View>
        );
      })}
    </View>
  );
}

/** 결론 제목 — 날짜만 로즈로 칠해 시선이 먼저 닿게 한다 */
export function TrackingHeadline(props: { date?: string; text: string; sub?: string | null }) {
  const { date, text, sub } = props;

  return (
    <View className="px-14" style={{ paddingTop: 22 }}>
      <Typography
        style={{ fontSize: 19, fontWeight: "700", lineHeight: 26.6, letterSpacing: -0.5 }}
        className="text-ink"
      >
        {!!date && <Typography className="text-rose">{date} </Typography>}
        {text}
      </Typography>
      {!!sub && (
        <Typography style={{ fontSize: 13, lineHeight: 20.8, marginTop: 7 }} className="text-gray45">
          {sub}
        </Typography>
      )}
    </View>
  );
}

/** 택배사 · 송장번호 행 — 라벨 열 68, 값은 오른쪽 정렬 */
export function CarrierRows(props: {
  carrier: TrackingCarrier | null;
  trackingNumber: string | null;
  invoiceLabel?: string;
  extraRows?: Array<{ label: string; value: string }>;
}) {
  const { carrier, trackingNumber, invoiceLabel = "송장번호", extraRows = [] } = props;

  return (
    <View className="px-14 pt-18" style={{ gap: 9 }}>
      <KeyValueRow label="택배사" value={carrier?.label ?? "-"} />
      <View className="flex-row items-center justify-between" style={{ gap: 12 }}>
        <Typography style={{ width: 68, fontSize: 13, lineHeight: 19.5 }} className="text-gray45">
          {invoiceLabel}
        </Typography>
        <Typography
          style={{ flex: 1, fontSize: 13, fontWeight: "500", lineHeight: 19.5, textAlign: "right" }}
          className="text-ink"
        >
          {trackingNumber ?? "-"}
        </Typography>
        {!!trackingNumber && (
          <CopyButton size={14} onPress={() => copyToClipboard(trackingNumber, "송장번호를 복사했어요")} />
        )}
      </View>
      {extraRows.map(row => (
        <KeyValueRow key={row.label} label={row.label} value={row.value} />
      ))}
    </View>
  );
}

export function KeyValueRow(props: { label: string; value: string }) {
  return (
    <View className="flex-row items-baseline justify-between" style={{ gap: 12 }}>
      <Typography style={{ width: 68, fontSize: 13, lineHeight: 19.5 }} className="text-gray45">
        {props.label}
      </Typography>
      <Typography
        style={{ flex: 1, fontSize: 13, fontWeight: "500", lineHeight: 19.5, textAlign: "right" }}
        className="text-ink"
      >
        {props.value}
      </Typography>
    </View>
  );
}

/** [택배사 전화하기] · [택배사에서 조회 ↗] — 값이 없는 쪽은 그리지 않는다 */
export function CarrierButtons(props: { carrier: TrackingCarrier | null }) {
  const { carrier } = props;

  if (!carrier?.tel && !carrier?.trackingUrl) {
    return null;
  }
  return (
    <View className="flex-row px-14 pt-16" style={{ gap: 7 }}>
      {!!carrier.tel && (
        <TouchableOpacity
          onPress={() => void Linking.openURL(`tel:${carrier.tel}`)}
          activeOpacity={0.55}
          className="h-44 min-w-0 flex-1 items-center justify-center rounded-base border-[1px] border-borderButton"
        >
          <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 }} className="text-ink76">
            택배사 전화하기
          </Typography>
        </TouchableOpacity>
      )}
      {!!carrier.trackingUrl && (
        <TouchableOpacity
          onPress={() => void Linking.openURL(carrier.trackingUrl as string)}
          activeOpacity={0.55}
          className="h-44 min-w-0 flex-1 flex-row items-center justify-center rounded-base border-[1px] border-borderButton"
          style={{ gap: 5 }}
        >
          <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 }} className="text-ink76">
            택배사에서 조회
          </Typography>
          <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
            <Path d="M9.5 8H16v6.5" stroke="#C7C7C7" strokeWidth={3} strokeLinecap="round" />
            <Path d="M8.4 15.6L16 8" stroke="#C7C7C7" strokeWidth={3} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      )}
    </View>
  );
}

export interface TimelineRow {
  key: string;
  title: string;
  time: string;
  /** 회수 조회의 브랜드 이벤트 — 회색 [브랜드] 표시를 앞에 붙인다 */
  isBrand?: boolean;
}

/**
 * 스캔 이력 — 첫 건만 잉크·굵은 링, 나머지는 회색·빈 점이라 어디까지가 "지금"인지 갈린다.
 * 원문(위치 · 단계)은 택배사 표기 그대로 둔다 — 번역하면 오역이 곧 문의가 된다.
 */
export function Timeline(props: { rows: Array<TimelineRow>; firstFilled?: boolean; gap?: number }) {
  const { rows, firstFilled = false, gap = 15 } = props;

  return (
    <View className="px-14 pt-18">
      {rows.map((row, ix) => {
        const isFirst = ix === 0;
        const isLast = ix === rows.length - 1;
        const dotBorderWidth = isFirst && !firstFilled ? 4 : 2;

        return (
          <View key={row.key} className="flex-row" style={{ gap: 11 }}>
            <View className="items-center" style={{ width: 14 }}>
              <View
                className="rounded-full"
                style={{
                  width: 14,
                  height: 14,
                  marginTop: 3,
                  borderWidth: isFirst && firstFilled ? 0 : dotBorderWidth,
                  borderColor: isFirst ? "#0F0F0F" : "#DEDEE0",
                  backgroundColor: isFirst && firstFilled ? "#0F0F0F" : "#FFFFFF",
                }}
              />
              <View
                style={{
                  flex: 1,
                  width: 2,
                  marginVertical: 3,
                  backgroundColor: isLast ? "transparent" : "#EAEAEC",
                }}
              />
            </View>
            <View className="min-w-0 flex-1" style={{ paddingBottom: isLast ? 0 : gap }}>
              <View className="flex-row items-center" style={{ gap: 6 }}>
                {row.isBrand && (
                  <View className="rounded-base bg-fill" style={{ paddingHorizontal: 6, paddingVertical: 3 }}>
                    <Typography
                      style={{ fontSize: 10.5, fontWeight: "600", lineHeight: 10.5 }}
                      className="text-gray45"
                    >
                      브랜드
                    </Typography>
                  </View>
                )}
                <Typography
                  style={{ fontSize: 14, fontWeight: isFirst ? "600" : "400", lineHeight: 19.6 }}
                  className={`min-w-0 flex-1 ${isFirst ? "text-ink" : "text-gray45"}`}
                >
                  {row.title}
                </Typography>
              </View>
              <Typography
                style={{ fontSize: 12, lineHeight: 16.8, marginTop: 3 }}
                className={isFirst ? "text-ink76" : "text-gray62"}
              >
                {row.time}
              </Typography>
            </View>
          </View>
        );
      })}
    </View>
  );
}

/** 「·」 한 줄 면책 — 추적 정보는 폴링 주기만큼 늦다 */
export function DisclaimerLine(props: { text: string }) {
  return (
    <View className="flex-row px-14" style={{ paddingTop: 4, gap: 6 }}>
      <Typography style={{ fontSize: 11.5, lineHeight: 19.55 }} className="text-gray45">
        ·
      </Typography>
      <Typography style={{ fontSize: 11.5, lineHeight: 19.55 }} className="min-w-0 flex-1 text-gray45">
        {props.text}
      </Typography>
    </View>
  );
}

/** 이력 접기·펼치기 — 대부분은 최신 상태만 보므로 4건까지만 펼친다 */
export function useCollapsibleRows<T>(rows: Array<T>, limit = 4) {
  const [isOpen, setIsOpen] = useState(false);

  return {
    visible: isOpen ? rows : rows.slice(0, limit),
    canToggle: rows.length > limit,
    isOpen,
    toggle: () => setIsOpen(prev => !prev),
  };
}

export function ToggleRowsButton(props: { isOpen: boolean; total: number; onPress: () => void }) {
  const { isOpen, total, onPress } = props;

  return (
    <View className="px-14 pt-14">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.55}
        className="h-44 flex-row items-center justify-center rounded-base border-[1px] border-borderButton"
        style={{ gap: 6 }}
      >
        <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 }} className="text-ink76">
          {isOpen ? "이력 접기" : `이력 전체 보기 (${total}건)`}
        </Typography>
        <View style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}>
          <ChevronDownIcon size={12} color="#3C3C3C" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

/** 지난 칸 잉크 · 지금 칸 로즈(라벨은 잉크 600) · 남은 칸 회색 */
function stageTone(isPast: boolean, isCurrent: boolean) {
  if (isCurrent) {
    return { bar: "#F2456E", label: "#0F0F0F" };
  }
  if (isPast) {
    return { bar: "#0F0F0F", label: "#3C3C3C" };
  }
  return { bar: "#EAEAEC", label: "#9E9E9E" };
}
