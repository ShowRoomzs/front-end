import { TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { Address } from "@/features/mypage/types/address";

/**
 * 배송지 한 건 (C13).
 *
 * **카드가 아니라 행**이다. 배송지는 글자만으로 판별되는 정보라 테두리 카드로 감싸면
 * 목록이 무거워지기만 한다. 0.5px 구분선과 여백으로 나눈다.
 *
 * 받는 분 이름이 가장 크고 굵다 — 별칭(집·회사)이 없으므로 배송지를 구별하는 첫 단서가
 * 누구에게 가는지다.
 *
 * [기본 배송지]는 **기본이 아닌 항목에만** 버튼으로 붙는다. 기본인 항목에는 배지만 있고
 * 버튼이 없어, 이미 기본이라는 사실이 버튼의 부재로도 읽힌다.
 *
 * 상태를 바꾸는 [기본 배송지](높이 30)가 편집 계열([수정]·[삭제], 높이 34)보다 한 단계 작다 —
 * 항목의 성격을 바꾸는 조작이 편집보다 무겁게 보이면 위계가 뒤집힌다.
 */
interface AddressRowProps {
  address: Address;
  isFirst: boolean;
  onPressSetDefault: (address: Address) => void;
  onPressEdit: (address: Address) => void;
  onPressDelete: (address: Address) => void;
}

export default function AddressRow(props: AddressRowProps) {
  const { address, isFirst, onPressSetDefault, onPressEdit, onPressDelete } = props;
  const isDefault = address.default;

  return (
    <View
      className="bg-white px-14 py-16"
      style={isFirst ? undefined : { borderTopWidth: 0.5, borderTopColor: "#F0F0F0" }}
    >
      <View className="h-20 flex-row items-center" style={{ gap: 7 }}>
        <Typography style={{ fontSize: 14.5, fontWeight: "600", lineHeight: 14.5 }} className="text-ink">
          {address.recipientName}
        </Typography>

        {isDefault && (
          <View className="rounded-base bg-roseTint px-8 py-4">
            <Typography variant="badge" className="text-roseText">
              기본 배송지
            </Typography>
          </View>
        )}

        <View className="flex-1" />

        {!isDefault && (
          <TouchableOpacity
            onPress={() => onPressSetDefault(address)}
            activeOpacity={0.55}
            style={{ paddingTop: 7, paddingBottom: 7, paddingLeft: 12, marginVertical: -15 }}
          >
            <View className="h-30 flex-row items-center rounded-base border-[1px] border-borderButton px-11">
              <Typography
                style={{ fontSize: 11.5, fontWeight: "600", lineHeight: 11.5 }}
                className="text-ink76"
              >
                기본 배송지
              </Typography>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <Typography style={{ fontSize: 13, lineHeight: 18.2, marginTop: 8 }} className="text-ink76">
        {address.phoneNumber}
      </Typography>

      <Typography style={{ fontSize: 13, lineHeight: 20.8, marginTop: 5 }} className="text-ink76">
        {`${address.address} ${address.detailAddress} (${address.zipCode})`}
      </Typography>

      {!!address.memo && (
        <Typography style={{ fontSize: 12, lineHeight: 18, marginTop: 6 }} className="text-gray45">
          {address.memo}
        </Typography>
      )}

      <View className="flex-row" style={{ gap: 8, marginTop: 7 }}>
        <AddressRowAction label="수정" onPress={() => onPressEdit(address)} />
        <AddressRowAction label="삭제" onPress={() => onPressDelete(address)} />
      </View>
    </View>
  );
}

/** [수정]·[삭제] — 둘 다 중립 외곽선이다. 삭제에 로즈를 쓰지 않는다(파괴적 액션은 강조하지 않는다) */
function AddressRowAction(props: { label: string; onPress: () => void }) {
  const { label, onPress } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.55}
      style={{ paddingVertical: 5, marginVertical: -5 }}
    >
      <View className="h-34 flex-row items-center rounded-base border-[1px] border-borderButton px-14">
        <Typography style={{ fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 }} className="text-ink76">
          {label}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
