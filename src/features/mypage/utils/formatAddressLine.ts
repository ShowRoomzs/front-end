import { Address } from "@/features/mypage/types/address";

/** 배송지 한 줄 — 「서울특별시 강남구 테헤란로 000, 00동 000호 (06234)」. 상세 주소가 없으면 쉼표도 뺀다 */
export function formatAddressLine(address: Pick<Address, "address" | "detailAddress" | "zipCode">): string {
  return `${address.address}${address.detailAddress ? `, ${address.detailAddress}` : ""} (${address.zipCode})`;
}
