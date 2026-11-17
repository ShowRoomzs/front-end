interface ParseDeepLinkResult {
  /** 인스타그램 앱으로 여는 주소 — 프로필이 아니면(게시물 · 릴스 등) 웹 주소와 같다 */
  appUrl: string;
  webUrl: string;
}

/** `instagram.com/{이것}/…`이 계정 아이디가 아닌 경로 — 게시물 · 릴스 · 스토리 등 */
const NON_PROFILE_PATHS = new Set([
  "p",
  "reel",
  "reels",
  "tv",
  "stories",
  "explore",
  "accounts",
  "direct",
  "about",
  "legal",
]);

/** 인스타그램 아이디 규칙 — 영문 · 숫자 · 마침표 · 밑줄, 30자 이하 */
const USERNAME = /^[A-Za-z0-9._]{1,30}$/;

function profile(userName: string): ParseDeepLinkResult {
  return {
    appUrl: `instagram://user?username=${userName}`,
    webUrl: `https://www.instagram.com/${userName}/`,
  };
}

/**
 * 인스타그램 딥링크.
 *
 * 쇼룸이 소비자에게 공개하는 채널은 인스타그램 하나다(§22-1) — 유튜브·틱톡·X 파서는
 * 마켓 SNS 목록과 함께 사라졌다.
 *
 * 크리에이터가 넣는 값은 프로필 주소만이 아니다 — `@아이디` · 아이디만 · 공유 꼬리(`?igsh=…`)가 붙은 주소 ·
 * 릴스 · 게시물 주소까지 들어온다. 주소의 **마지막 조각을 아이디로 읽으면** 릴스 주소(`/reels/C1ge…/`)가
 * 없는 계정(`instagram.com/C1ge…`)으로 바뀐다. 그래서 프로필 주소(`instagram.com/{아이디}`)일 때만
 * 아이디를 뽑아 앱 프로필로 열고, 그 밖의 인스타 주소는 받은 주소 그대로 연다(앱이 있으면 OS가 앱으로 넘긴다).
 * 아무것도 못 알아보면 받은 값을 그대로 연다 — 링크가 죽는 것보다 낫다.
 */
export function parseInstagramLink(instagramUrl: string): ParseDeepLinkResult {
  const raw = instagramUrl.trim();
  const bare = raw.replace(/^@/, "");

  // `@아이디` · 아이디만 넣은 경우
  if (USERNAME.test(bare)) {
    return profile(bare);
  }

  let url: URL;

  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { appUrl: raw, webUrl: raw };
  }

  if (!/(^|\.)instagram\.com$/i.test(url.hostname)) {
    return { appUrl: raw, webUrl: raw };
  }

  const [first] = url.pathname.split("/").filter(Boolean);

  if (first && !NON_PROFILE_PATHS.has(first.toLowerCase()) && USERNAME.test(first)) {
    return profile(first);
  }

  // 게시물 · 릴스 등 — 공유 꼬리(?igsh=…)만 떼고 그 주소로 연다
  const webUrl = `https://www.instagram.com${url.pathname}`;

  return { appUrl: webUrl, webUrl };
}
