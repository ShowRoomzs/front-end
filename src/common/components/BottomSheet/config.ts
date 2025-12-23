import { SnapPoint } from "@/common/components/BottomSheet/BottomSheet";

export function getMinHeight(snapPoint: SnapPoint, maxHeight: number): number {
  if (typeof snapPoint === "number") {
    return maxHeight - snapPoint;
  }
  return maxHeight - (Number(snapPoint.replace("%", "")) / 100) * maxHeight;
}
