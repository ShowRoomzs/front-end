export function filterSpecialCharacters(str: string): string {
  return str.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, "");
}
