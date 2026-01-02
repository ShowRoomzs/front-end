export function filterSpecialCharacters(str: string): string {
  return str.replace(/[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, "");
}
