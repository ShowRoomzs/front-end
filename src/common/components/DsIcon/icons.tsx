import Svg, { Circle, Path, SvgProps } from "react-native-svg";

/**
 * 디자인 시스템 v0.1 · 04 아이콘 — 각진 라인 세트.
 *
 * stroke 1.6~1.7 · miter join · 24 그리드. 헤더·탭바 25×25, 게시물 ⋯ 20×20.
 * 탭바 활성만 채움(fill), 나머지는 선.
 *
 * path는 디자인 캔버스(.dc.html)에서 그대로 가져왔다 — 아이콘을 다시 그리면
 * 굵기·곡률이 미묘하게 어긋나 각진 세트의 통일감이 깨진다.
 */
export interface DsIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const DEFAULT_SIZE = 25;

function base(props: DsIconProps) {
  const { size = DEFAULT_SIZE, color = "#0F0F0F", ...rest } = props;

  return { size, color, rest };
}

/** 장바구니 — 헤더 */
export function CartIcon(props: DsIconProps) {
  const { size, color, rest } = base(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path d="M4.4 7.5h15.2l-1.1 12.3H5.5z" stroke={color} strokeWidth={1.6} strokeLinejoin="miter" />
      <Path d="M8.8 10V6.6a3.2 3.2 0 0 1 6.4 0V10" stroke={color} strokeWidth={1.6} strokeLinejoin="miter" />
    </Svg>
  );
}

/** 알림 — 헤더 */
export function BellIcon(props: DsIconProps) {
  const { size, color, rest } = base(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M6 9.6a6 6 0 0 1 12 0v4.9l1.6 3H4.4l1.6-3z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="miter"
      />
      <Path d="M9.8 20.4h4.4" stroke={color} strokeWidth={1.6} strokeLinejoin="miter" />
    </Svg>
  );
}

/** 검색 — 검색 필드 안 돋보기(19) · 최근 검색 행(19) · 소형(16) */
export function SearchIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, color: props.color ?? "#8E8E8E" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} strokeLinecap="square" />
      <Path d="M20 20l-3.6-3.6" stroke={color} strokeWidth={2} strokeLinecap="square" />
    </Svg>
  );
}

/**
 * 하트 — 곡률이 부드러운 형태. 기본 선(잉크) → 누르면 로즈 채움 →
 * 마감된 공구는 #C8C8CA(새 좋아요 불가 · 해제만 가능).
 */
export function HeartIcon(props: DsIconProps & { filled?: boolean }) {
  const { filled = false, ...restProps } = props;
  const { size, color, rest } = base(restProps);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M12 20.6c-.35 0-.7-.12-.96-.37C7.4 16.9 3.6 13.5 3.6 9.9c0-2.7 2.1-4.8 4.7-4.8 1.4 0 2.7.6 3.7 1.7 1-1.1 2.3-1.7 3.7-1.7 2.6 0 4.7 2.1 4.7 4.8 0 3.6-3.8 7-7.44 10.33-.26.25-.61.37-.96.37z"
        stroke={color}
        fill={filled ? color : "none"}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 홈 탭 */
export function HomeIcon(props: DsIconProps & { active?: boolean }) {
  const { active = false, ...restProps } = props;
  const { size, color, rest } = base(restProps);
  const d = "M4 10.6 12 4.2l8 6.4V19a1.4 1.4 0 0 1-1.4 1.4h-3.9v-5.9h-5.4v5.9H5.4A1.4 1.4 0 0 1 4 19z";

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d={d}
        fill={active ? color : "none"}
        stroke={active ? "none" : color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 팔로잉 탭 — 두 사람 */
export function FollowingIcon(props: DsIconProps & { active?: boolean }) {
  const { active = false, ...restProps } = props;
  const { size, color, rest } = base(restProps);

  if (active) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
        <Circle cx={9} cy={8} r={3.2} fill={color} />
        <Path d="M3.5 19.9c0-3.3 2.5-5.6 5.5-5.6s5.5 2.3 5.5 5.6z" fill={color} />
        <Circle cx={17.2} cy={8.2} r={2.9} fill={color} />
        <Path d="M17.2 14.4c2 .6 3.3 2.5 3.3 5.1h-4.2c0-1.9-.4-3.6-1.1-4.9.6-.15 1.3-.2 2-.2z" fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Circle cx={9} cy={8} r={3.2} stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path
        d="M3.5 19.5c0-3.1 2.5-5.2 5.5-5.2s5.5 2.1 5.5 5.2"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.2 11.2a3 3 0 1 0 0-6"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.2 14.4c2 .6 3.3 2.5 3.3 5.1"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 마이 탭 — 한 사람 */
export function ProfileIcon(props: DsIconProps & { active?: boolean }) {
  const { active = false, ...restProps } = props;
  const { size, color, rest } = base(restProps);

  if (active) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
        <Circle cx={12} cy={8} r={3.7} fill={color} />
        <Path
          d="M12 13.6c-4.1 0-7.4 2.9-7.4 6.5 0 .5.4.9.9.9h13c.5 0 .9-.4.9-.9 0-3.6-3.3-6.5-7.4-6.5z"
          fill={color}
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Circle cx={12} cy={8} r={3.5} stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
      <Path
        d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 게시물 ⋯ — 신고 시트를 연다. 20×20 채움 */
export function MoreIcon(props: DsIconProps & { vertical?: boolean }) {
  const { vertical = false, ...iconProps } = props;
  const { size, color, rest } = base({ ...iconProps, size: props.size ?? 20 });
  // 피드 카드는 가로(⋯), 게시물 상세는 세로(⋮)다 — 목록 안의 항목 메뉴와
  // 화면 하나에 대한 메뉴를 방향으로 구분한다
  const dots: Array<[number, number]> = vertical
    ? [
        [12, 5.5],
        [12, 12],
        [12, 18.5],
      ]
    : [
        [5.5, 12],
        [12, 12],
        [18.5, 12],
      ];

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      {dots.map(([cx, cy]) => (
        <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.6} fill={color} />
      ))}
    </Svg>
  );
}

/** 셰브런 아래 — 아코디언 · 더보기 버튼(펼치면 180° 회전) */
export function ChevronDownIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 12 });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path d="M5 9l7 7 7-7" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** 셰브런 오른쪽 — 메뉴 행 */
export function ChevronRightIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 16, color: props.color ?? "#C7C7C7" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** 닫기 X — 최근 검색 개별 삭제(14) · 검색 필드 지우기 안쪽(9, 흰색) */
export function CloseIcon(props: DsIconProps & { thickness?: number }) {
  const { thickness = 2.4, ...iconProps } = props;
  const { size, color, rest } = base({
    ...iconProps,
    size: iconProps.size ?? 14,
    color: iconProps.color ?? "#C7C7C7",
  });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path d="M6 6l12 12" stroke={color} strokeWidth={thickness} strokeLinecap="round" />
      <Path d="M18 6L6 18" stroke={color} strokeWidth={thickness} strokeLinecap="round" />
    </Svg>
  );
}

/** 체크 — 시트 선택(로즈 19 · stroke 2.6) · 흰 체크 */
export function CheckIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 19, color: props.color ?? "#F2456E" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M4.5 12.5l5 5 10-11"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 안내 배너 아이콘 — 18px */
export function InfoIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 18, color: props.color ?? "#8E8E8E" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={2} />
      <Path d="M12 8v5" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 15.6v.1" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** 빈 상태 일러스트 — 장바구니(52) · 쇼핑백 */
/**
 * 차양 달린 상점 — 팔로우할 **쓰룸**을 가리키는 빈 상태 아이콘 (C2 팔로잉 1b · 1c).
 *
 * 사람 아이콘을 쓰지 않는다 — 팔로우는 계정이 아니라 공구를 여는 쓰룸에 거는 것이고,
 * 장바구니(가방)도 아니다 — 그건 담은 물건을 가리키는 그림이다.
 */
export function StorefrontIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 52, color: props.color ?? "#D8D8DA" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M4 4.5h16l1.4 4.2a3 3 0 0 1-5.8 1 3 3 0 0 1-5.6 0 3 3 0 0 1-5.8-1z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="miter"
      />
      <Path d="M5 10.8V20h14v-9.2" stroke={color} strokeWidth={1.2} strokeLinejoin="miter" />
      <Path d="M9.6 20v-5.4h4.8V20" stroke={color} strokeWidth={1.2} strokeLinejoin="miter" />
    </Svg>
  );
}

export function EmptyBagIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 52, color: props.color ?? "#D8D8DA" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path d="M4.4 7.5h15.2l-1.1 12.3H5.5z" stroke={color} strokeWidth={1.2} strokeLinejoin="miter" />
      <Path d="M8.8 10V6.6a3.2 3.2 0 0 1 6.4 0V10" stroke={color} strokeWidth={1.2} strokeLinejoin="miter" />
    </Svg>
  );
}

/**
 * 자물쇠 — 비밀글 표시(C7 문의 목록 · C12 문의 내역).
 *
 * 비밀글은 목록에서 **지우지 않고 자물쇠로 자리를 남긴다.** 숨겨 버리면 목록의 건수가 어긋나고,
 * 글을 쓴 사람도 자기 문의가 접수됐는지 확인할 수 없다.
 */
export function LockIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 15, color: props.color ?? "#8E8E8E" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path d="M5.5 10.5h13v9h-13z" stroke={color} strokeWidth={1.8} strokeLinejoin="miter" />
      <Path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" stroke={color} strokeWidth={1.8} strokeLinejoin="miter" />
    </Svg>
  );
}

/**
 * 쇼핑백(토트) — 안내 배너의 아이콘. 디자인 시스템 §05의 "진행 중인 공구가 없어요" 블록이
 * 물음표·느낌표가 아니라 이 그림을 쓴다 — 안내의 내용이 "살 것"에 대한 것이기 때문이다.
 */
export function ShoppingBagIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 18, color: props.color ?? "#8E8E8E" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M4 4.5h16l1.4 4.2a3 3 0 0 1-5.8 1 3 3 0 0 1-5.6 0 3 3 0 0 1-5.8-1z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="miter"
      />
      <Path d="M5 10.8V20h14v-9.2" stroke={color} strokeWidth={1.5} strokeLinejoin="miter" />
    </Svg>
  );
}

/**
 * 빈 상자 — **게시물이 아직 없는 쇼룸**(C4 1b).
 *
 * 장바구니의 빈 상태(가방)와 다른 그림을 쓴다. 가방은 "담을 것"을, 상자는 "아직 열지 않은 것"을
 * 가리킨다 — 첫 공구를 기다리는 쇼룸에는 뒤쪽이 맞다.
 */
export function EmptyBoxIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 50, color: props.color ?? "#D8D8DA" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path d="M4.5 8.5h15v11h-15z" stroke={color} strokeWidth={1.2} strokeLinejoin="miter" />
      <Path d="M4.5 8.5 7 4.5h10l2.5 4" stroke={color} strokeWidth={1.2} strokeLinejoin="miter" />
      <Path d="M9.2 12.2h5.6" stroke={color} strokeWidth={1.2} strokeLinejoin="miter" />
    </Svg>
  );
}

/**
 * 말풍선 — 문의 답변 신호 (C12).
 *
 * 목록의 답변 미리보기(14 · #737373)와 빈 상태 일러스트(50 · #D8D8DA)가 같은 글리프를 쓴다.
 * "답변"이라는 한 가지 개념을 두 크기로 반복해, 비어 있는 화면도 무엇이 채워질 자리인지 말한다.
 */
export function SpeechBubbleIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 14, color: props.color ?? "#737373" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M4.5 5.5h15v11h-9l-4 3.5z"
        stroke={color}
        strokeWidth={props.size && props.size >= 40 ? 1.2 : 1.8}
        strokeLinejoin="miter"
      />
    </Svg>
  );
}

/** 빈 상태 일러스트 — 배송지(50) · 지도 핀 */
export function EmptyPinIcon(props: DsIconProps) {
  const { size, color, rest } = base({ ...props, size: props.size ?? 50, color: props.color ?? "#D8D8DA" });

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M12 21c4.5-4.8 7-8 7-11a7 7 0 1 0-14 0c0 3 2.5 6.2 7 11z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="miter"
      />
      <Circle cx={12} cy={10} r={2.6} stroke={color} strokeWidth={1.2} />
    </Svg>
  );
}
