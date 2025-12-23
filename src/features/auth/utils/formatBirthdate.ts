/**
 * 숫자 입력을 YYYY.MM.DD 형태로 자동 포맷
 * 입력 중간 단계도 허용
 */
export function formatBirthdate(input: string): string {
  // 숫자만 남김
  const digits = input.replace(/\D/g, "").slice(0, 8);

  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);

  if (digits.length <= 4) {
    return y;
  }

  if (digits.length <= 6) {
    return `${y}.${m}`;
  }

  return `${y}.${m}.${d}`;
}
