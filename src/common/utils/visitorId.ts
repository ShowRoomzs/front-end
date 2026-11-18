import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

import { ASYNC_STORAGE } from "@/common/constants/asyncStorage";

let visitorIdPromise: Promise<string> | null = null;

async function loadOrCreate() {
  try {
    const saved = await AsyncStorage.getItem(ASYNC_STORAGE.VISITOR_ID);

    if (saved) {
      return saved;
    }
    const created = randomUUID();

    await AsyncStorage.setItem(ASYNC_STORAGE.VISITOR_ID, created);

    return created;
  } catch {
    // 저장소를 못 쓰면(웹 사생활 보호 창 등) 이번 실행 동안만 같은 값을 쓴다 — 기록이 400으로 버려지는 것보다 낫다
    return randomUUID();
  }
}

/**
 * 이 기기의 방문자 식별값 — 쇼룸 방문 · 게시물 노출 · 상품 상세 조회 기록에 **같은 값**을 싣는다.
 *
 * 서버는 비로그인 기록에 이 값이 없으면 400으로 거절한다(방문자 수가 부풀지 않게). 세 기록이 같은 값이어야
 * 「이 게시물을 보고 쇼룸 · 상품에 왔다」는 귀속이 이어진다. 로그인 상태면 서버가 사용자 기준으로 세고 이 값은 무시한다.
 *
 * 처음 한 번 만들어 기기에 저장하고 계속 쓴다. 로그아웃해도 지우지 않는다 — 사람이 아니라 기기를 가리키는 값이다.
 */
export function getVisitorId() {
  visitorIdPromise ??= loadOrCreate();

  return visitorIdPromise;
}
