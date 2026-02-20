import { SnsLink } from "@/features/market/types/market";

interface ParseDeepLinkResult {
  appUrl: string;
  webUrl: string;
}
function parseInstagram(snsUrl: string): ParseDeepLinkResult {
  const userName = snsUrl.split("/").pop();

  if (!userName) {
    throw new Error("Invalid Instagram URL");
  }
  return {
    appUrl: `instagram://user?username=${userName}`,
    webUrl: `https://www.instagram.com/${userName}`,
  };
}

function parseYoutube(snsUrl: string): ParseDeepLinkResult {
  const channelId = snsUrl.split("/").pop();

  if (!channelId) {
    throw new Error("Invalid Youtube URL");
  }

  return {
    appUrl: `youtube://www.youtube.com/channel/${channelId}`,
    webUrl: `https://www.youtube.com/channel/${channelId}`,
  };
}

function parseTiktok(snsUrl: string): ParseDeepLinkResult {
  const userName = snsUrl.split("/").pop();

  if (!userName) {
    throw new Error("Invalid Tiktok URL");
  }
  return {
    appUrl: `tiktok://user/${userName}`,
    webUrl: `https://www.tiktok.com/${userName}`,
  };
}

function parseX(snsUrl: string): ParseDeepLinkResult {
  const userName = snsUrl.split("/").pop();

  if (!userName) {
    throw new Error("Invalid X URL");
  }
  return {
    appUrl: `twitter://user?screen_name=${userName}`,
    webUrl: `https://x.com/${userName}`,
  };
}

export function parseDeepLink(snsLink: SnsLink): ParseDeepLinkResult {
  const { snsType, snsUrl } = snsLink;

  // TODO : 각 플랫폼 실기기에서 테스트 필요
  switch (snsType) {
    case "INSTAGRAM":
      return parseInstagram(snsUrl);
    case "YOUTUBE":
      return parseYoutube(snsUrl);
    case "TIKTOK":
      return parseTiktok(snsUrl);
    case "X":
      return parseX(snsUrl);
    default:
      throw new Error("Invalid SNS URL");
  }
}
