import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { SellerInfo } from "@/features/product/types/product";

/**
 * 판매자 정보 — 전자상거래법 표시 항목이다.
 *
 * 쇼룸즈는 통신판매중개자라 거래 당사자가 아니고, 상품·배송·환불의 책임은 각 판매자에게 있다.
 * 그래서 이 값들은 "참고 정보"가 아니라 반드시 읽을 수 있어야 하며, 값이 비어 있으면 빈 줄을
 * 남기지 않고 행 자체를 그리지 않는다.
 *
 * **표가 아니라 키·값 목록이다.** 항목이 일곱 줄로 고정이고 값이 한 줄씩이라, 테두리를 두르면
 * 읽을 것보다 선이 많아진다. 위의 상품 고시(표)와 형태를 달리해 둘이 섞여 보이지 않게 한다.
 */
interface ProductSellerInfoProps {
  sellerInfo?: SellerInfo;
}

const SELLER_INFO_LABELS: Array<{ field: keyof SellerInfo; label: string }> = [
  { field: "companyName", label: "상호명" },
  { field: "representativeName", label: "대표자" },
  { field: "businessRegistrationNumber", label: "사업자등록번호" },
  { field: "mailOrderRegNumber", label: "통신판매업 신고번호" },
  { field: "businessAddress", label: "사업장 소재지" },
  { field: "csNumber", label: "고객센터" },
  { field: "email", label: "이메일" },
];

export default function ProductSellerInfo(props: ProductSellerInfoProps) {
  const { sellerInfo } = props;

  if (!sellerInfo) {
    return null;
  }

  const rows = SELLER_INFO_LABELS.filter(({ field }) => !!sellerInfo[field]);

  return (
    <View>
      {rows.map(({ field, label }) => (
        <View key={field} className="flex-row items-baseline" style={{ gap: 12, paddingVertical: 7 }}>
          <Typography style={{ fontSize: 12.5, lineHeight: 20 }} className="text-gray45 w-116">
            {label}
          </Typography>
          <Typography
            style={{ fontSize: 12.5, fontWeight: "500", lineHeight: 20 }}
            className="min-w-0 flex-1 text-ink76"
          >
            {sellerInfo[field]}
          </Typography>
        </View>
      ))}
    </View>
  );
}
