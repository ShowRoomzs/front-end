interface ParseDeepLinkResult {
  appUrl: string;
  webUrl: string;
}

/**
 * 인스타그램 딥링크.
 *
 * 쇼룸이 소비자에게 공개하는 채널은 인스타그램 하나다(§22-1) — 유튜브·틱톡·X 파서는
 * 마켓 SNS 목록과 함께 사라졌다.
 *
 * 앱이 깔려 있으면 앱으로, 아니면 웹으로 연다. 파싱에 실패하면 받은 URL을 그대로 웹으로 연다 —
 * 프로필 주소 형태가 조금 달라도 링크가 죽는 것보다 낫다.
 */
export function parseInstagramLink(instagramUrl: string): ParseDeepLinkResult {
  const userName = instagramUrl.replace(/\/+$/, "").split("/").pop();

  if (!userName) {
    return { appUrl: instagramUrl, webUrl: instagramUrl };
  }

  return {
    appUrl: `instagram://user?username=${userName}`,
    webUrl: `https://www.instagram.com/${userName}`,
  };
}
