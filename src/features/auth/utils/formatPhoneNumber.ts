/** 01012345678 → 010-1234-5678. 11자리가 아니면 그대로 돌려준다(서버로 나갈 때 최종 변환용) */
export function formatPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length !== 11) {
    return phoneNumber;
  }

  return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
}

/**
 * 입력 중에도 하이픈을 붙여 준다 — 다 치고 나서야 형태가 잡히면 자기가 제대로 넣었는지
 * 세어 봐야 한다. 상태에는 숫자만 담고 화면에만 이 값을 쓴다.
 *
 * 지우는 중에도 자연스럽게 풀린다 — "010-1"에서 지우면 숫자가 4자리 미만이 되어 하이픈이
 * 함께 사라진다. 하이픈만 지워 커서가 갇히는 일이 없다.
 */
export function formatPhoneNumberInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
