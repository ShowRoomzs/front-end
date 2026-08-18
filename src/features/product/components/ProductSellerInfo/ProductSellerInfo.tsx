import { useMemo } from "react";

import ProductNoticeTable, {
  NoticeRow,
} from "@/features/product/components/ProductNoticeTable/ProductNoticeTable";
import { SellerInfo } from "@/features/product/types/product";

/**
 * 판매자 정보 — 전자상거래법 표시 항목이다.
 *
 * 쇼룸즈는 통신판매중개자라 거래 당사자가 아니고, 상품·배송·환불의 책임은 각 판매자에게 있다.
 * 그래서 이 표는 "참고 정보"가 아니라 반드시 읽을 수 있어야 하는 값이며, 값이 비어 있으면
 * 빈 줄을 남기지 않고 행 자체를 그리지 않는다.
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

  const rows = useMemo((): Array<NoticeRow> => {
    if (!sellerInfo) {
      return [];
    }
    return SELLER_INFO_LABELS.filter(({ field }) => !!sellerInfo[field]).map(({ field, label }) => ({
      key: label,
      value: sellerInfo[field],
    }));
  }, [sellerInfo]);

  return <ProductNoticeTable title="판매자 정보" rows={rows} />;
}
