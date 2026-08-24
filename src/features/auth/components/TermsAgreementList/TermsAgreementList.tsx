import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Typography from "@/common/components/Typography/Typography";

/**
 * 약관 동의 목록 (C0-1).
 *
 * 전체 동의는 굵게 + 23px 체크, 개별은 21px다. [필수] 3개가 모두 켜져야 하단 CTA가 로즈로
 * 활성화되고, 하나라도 빠지면 회색으로 남는다.
 *
 * [필수]는 로즈, [선택]은 회색 태그로 구분한다 — 태그를 다 같은 색으로 두면 무엇을 빼도 되는지
 * 읽어 봐야 알게 된다.
 */
export type TermsKey = "age" | "service" | "privacy" | "marketing";

export interface TermsAgreementState {
  age: boolean;
  service: boolean;
  privacy: boolean;
  marketing: boolean;
}

export const INITIAL_TERMS: TermsAgreementState = {
  age: false,
  service: false,
  privacy: false,
  marketing: false,
};

export const REQUIRED_TERMS: Array<TermsKey> = ["age", "service", "privacy"];

const TERMS_DEFS: Array<{ key: TermsKey; required: boolean; label: string; hasLink: boolean }> = [
  { key: "age", required: true, label: "만 14세 이상입니다", hasLink: false },
  { key: "service", required: true, label: "서비스 이용약관 동의", hasLink: true },
  { key: "privacy", required: true, label: "개인정보 수집·이용 동의", hasLink: true },
  { key: "marketing", required: false, label: "광고성 정보 수신 동의", hasLink: true },
];

interface TermsAgreementListProps {
  value: TermsAgreementState;
  onChange: (next: TermsAgreementState) => void;
  onPressDetail?: (key: TermsKey) => void;
}

function CheckCircle(props: { checked: boolean; size: number }) {
  const { checked, size } = props;

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        borderWidth: 1.5,
        borderColor: checked ? "#F2456E" : "#DEDEE0",
        backgroundColor: checked ? "#F2456E" : "#FFFFFF",
      }}
    >
      <Svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4.5 12.5l5 5 10-11"
          stroke={checked ? "#FFFFFF" : "#DEDEE0"}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export default function TermsAgreementList(props: TermsAgreementListProps) {
  const { value, onChange, onPressDetail } = props;

  const isAllChecked = TERMS_DEFS.every(term => value[term.key]);

  const handleToggleAll = () => {
    const next = !isAllChecked;

    onChange({ age: next, service: next, privacy: next, marketing: next });
  };

  return (
    <View className="px-14 pt-6">
      <TouchableOpacity
        onPress={handleToggleAll}
        activeOpacity={0.6}
        className="flex-row items-center border-b-[1px] border-dividerProduct py-16"
        style={{ gap: 11 }}
      >
        <CheckCircle checked={isAllChecked} size={23} />
        <Typography style={{ fontSize: 15, fontWeight: "700", lineHeight: 15 }} className="text-ink">
          전체 동의
        </Typography>
      </TouchableOpacity>

      {TERMS_DEFS.map(term => (
        <View key={term.key} className="flex-row items-center py-13" style={{ gap: 11 }}>
          <TouchableOpacity
            onPress={() => onChange({ ...value, [term.key]: !value[term.key] })}
            activeOpacity={0.6}
            className="min-w-0 flex-1 flex-row items-center"
            style={{ gap: 11 }}
          >
            <CheckCircle checked={value[term.key]} size={21} />
            <Typography style={{ fontSize: 14, lineHeight: 19.6 }} className="text-ink76">
              <Typography
                style={{ fontWeight: "600" }}
                className={term.required ? "text-[#CF3D61]" : "text-gray55"}
              >
                {term.required ? "[필수]" : "[선택]"}
              </Typography>{" "}
              {term.label}
            </Typography>
          </TouchableOpacity>

          {term.hasLink && (
            <TouchableOpacity
              onPress={() => onPressDetail?.(term.key)}
              activeOpacity={0.6}
              style={{ paddingVertical: 8, marginVertical: -8 }}
            >
              <Typography
                style={{ fontSize: 12, fontWeight: "500", lineHeight: 12, textDecorationLine: "underline" }}
                className="flex-none text-gray45"
              >
                보기
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <View className="h-14" />
    </View>
  );
}
