/**
 * 목적격 조사 을/를을 받침 유무로 고른다 — "구성을 선택해 주세요" · "향을 선택해 주세요".
 *
 * 옵션 그룹 이름은 서버가 만드는 값이라 앱이 미리 알 수 없다. `을(를)`처럼 둘 다 적으면
 * 한 줄짜리 안내에 괄호가 끼어 시안과 달라지므로, 마지막 글자의 종성을 보고 하나만 남긴다.
 *
 * 한글이 아닌 글자(영문·숫자)로 끝나면 판단할 수 없다 — 읽는 방식이 사람마다 달라서다.
 * 그때는 `를`로 둔다(대부분의 영문 상품명이 모음으로 끝나는 발음이다).
 */
const HANGUL_SYLLABLE_START = 0xac00;
const HANGUL_SYLLABLE_END = 0xd7a3;
const FINAL_CONSONANT_COUNT = 28;

export function withObjectParticle(word: string): string {
  const lastCharacter = word.trim().slice(-1);
  const code = lastCharacter.charCodeAt(0);

  if (Number.isNaN(code) || code < HANGUL_SYLLABLE_START || code > HANGUL_SYLLABLE_END) {
    return `${word}를`;
  }

  const hasFinalConsonant = (code - HANGUL_SYLLABLE_START) % FINAL_CONSONANT_COUNT !== 0;

  return `${word}${hasFinalConsonant ? "을" : "를"}`;
}
