// 00000000000 > xxx-xxxx-xxxx
export function formatPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length !== 11) {
    return phoneNumber;
  }

  const formattedPhoneNumber = digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");

  return formattedPhoneNumber;
}
