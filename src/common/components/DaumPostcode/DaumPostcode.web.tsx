import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import type { DaumPostcodeData } from "./DaumPostcode";

import Typography from "@/common/components/Typography/Typography";

/**
 * 다음(카카오) 우편번호 서비스 — 도메인 등록 없이 어느 사이트에서나 쓸 수 있다.
 * t1.daumcdn.net은 2026-11-30 종료(서비스 공지) — 새 주소를 쓴다(앱 DaumPostcode.tsx와 같다)
 */
const POSTCODE_SCRIPT = "https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

interface DaumPostcodeInstance {
  embed: (element: HTMLElement) => void;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        width: string;
        height: string;
        animation: boolean;
        hideMapBtn: boolean;
      }) => DaumPostcodeInstance;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadPostcodeScript(): Promise<void> {
  if (window.daum?.Postcode) {
    return Promise.resolve();
  }
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");

    script.src = POSTCODE_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("postcode script failed"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

interface DaumPostcodeProps {
  onSubmit: (data: DaumPostcodeData) => void;
}

/**
 * 주소 검색 (웹) — 앱은 WebView 안에 우편번호 페이지를 띄우지만, 웹은 WebView가 없어 같은 스크립트를
 * 이 페이지에 직접 불러 검색 창을 그 자리에 심는다(`embed`). 고른 결과 모양은 앱과 같다.
 */
export default function DaumPostcode(props: DaumPostcodeProps) {
  const { onSubmit } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onSubmitRef = useRef(onSubmit);
  const [hasError, setHasError] = useState(false);

  onSubmitRef.current = onSubmit;

  useEffect(() => {
    let isMounted = true;

    loadPostcodeScript()
      .then(() => {
        if (!isMounted || !containerRef.current || !window.daum) {
          return;
        }
        new window.daum.Postcode({
          oncomplete: data => onSubmitRef.current(data),
          width: "100%",
          height: "100%",
          animation: true,
          hideMapBtn: true,
        }).embed(containerRef.current);
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (hasError) {
    return (
      <View className="flex-1 items-center justify-center px-24">
        <Typography className="text-center text-gray55">
          {"주소 검색을 불러오지 못했어요.\n잠시 후 다시 시도해 주세요."}
        </Typography>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </View>
  );
}
