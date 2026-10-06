import * as Clipboard from "expo-clipboard";

import { toast } from "@/common/providers/ToastProvider";

/** 주문번호 · 송장번호 · 반품센터 주소 복사 — 고객센터·택배사에 그대로 불러 주는 값이다 */
export async function copyToClipboard(value: string, label = "복사했어요") {
  try {
    await Clipboard.setStringAsync(value);
    toast.show(label);
  } catch {
    toast.show("복사하지 못했어요");
  }
}
