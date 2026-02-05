// 기준 날짜 이후 가장 가까운 평일을 반환하는 함수
export function getNextWeekday(date: Date): Date {
  const next = new Date(date);

  next.setDate(next.getDate() + 1);

  const day = next.getDay();

  if (day === 6) {
    next.setDate(next.getDate() + 2);
  } else if (day === 0) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}
