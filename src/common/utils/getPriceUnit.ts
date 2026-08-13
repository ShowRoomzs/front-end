import { PriceUnit } from "@/common/types/priceUnit";

export const PRICE_UNITS: Array<PriceUnit> = ["", "만", "억"];
export const PRICE_UNIT_MULTIPLIER = 10_000;

const UNIT_DIVISORS: Record<PriceUnit, number> = {
  "": 1,
  만: PRICE_UNIT_MULTIPLIER,
  억: PRICE_UNIT_MULTIPLIER * PRICE_UNIT_MULTIPLIER,
};

/**
 * 원 단위의 값에 적합한 가격 단위를 반환
 * @param value 원 단위의 값
 */
export function getPriceUnit(value: number): PriceUnit {
  if (value < PRICE_UNIT_MULTIPLIER) {
    return "";
  }

  const unit = Math.floor(Math.log(value) / Math.log(PRICE_UNIT_MULTIPLIER));
  const clamped = Math.min(Math.max(unit, 0), PRICE_UNITS.length - 1);

  return PRICE_UNITS[clamped];
}

/**
 * 원 단위의 값을 지정 단위 값으로 변환 (50000원 + 만 → 5)
 * @param value 원 단위의 값
 * @param unit 변환할 단위
 */
export function convertToUnitValue(value: number, unit: PriceUnit): number {
  return value / UNIT_DIVISORS[unit];
}

/**
 * 단위 값을 원 단위로 역변환 (5만 → 50000원)
 * @param value 단위 값
 * @param unit 값의 단위
 */
export function convertToPrice(value: number, unit: PriceUnit): number {
  return value * UNIT_DIVISORS[unit];
}

/**
 * 원 단위의 값을 적합한 단위의 표시 문자열로 변환 (50000 → "5만")
 * @param value 원 단위의 값
 */
export function getDisplayPrice(value: number): string {
  const unit = getPriceUnit(value);
  const converted = convertToUnitValue(value, unit);

  return `${converted}${unit}`;
}
