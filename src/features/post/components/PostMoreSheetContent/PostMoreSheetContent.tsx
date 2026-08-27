import { useCallback, useState } from "react";
import { Clipboard } from "react-native";

import SheetList, { SheetListItem } from "@/common/components/SheetList/SheetList";
import { toast } from "@/common/providers/ToastProvider";
import ReportSheetContent from "@/features/post/components/ReportSheetContent/ReportSheetContent";

/**
 * 게시물 ⋯ 메뉴 — 카드와 상세의 점 세 개에서 열린다.
 *
 * **신고를 바로 띄우지 않고 메뉴를 한 겹 둔다.** ⋯를 누르는 이유가 신고만은 아닌데 사유 목록이
 * 곧장 뜨면, 링크를 얻으려던 사람이 신고 화면을 마주하게 된다. 사유를 고르는 일은 그 다음이다.
 *
 * 시트를 갈아 끼우지 않고 **한 시트 안에서 단계만 바꾸는** 이유는, 닫았다 여는 사이에 배경이
 * 번쩍이고 높이가 튀기 때문이다.
 *
 * [이 쇼룸의 게시물 그만 보기]는 넣지 않았다 — 서버에 차단이 없어 눌러도 아무 일이 일어나지
 * 않는다. 동작하지 않는 메뉴는 없는 것보다 나쁘다.
 */
interface PostMoreSheetContentProps {
  postId: number;
  onClose: () => void;
}

type MoreStep = "menu" | "report";

type MoreAction = "report" | "copyLink";

/** 앱 스킴 딥링크 — 게시물을 공유하면 앱이 설치된 기기에서 그 게시물로 바로 열린다 */
function buildPostLink(postId: number) {
  return `showroomz://post/${postId}`;
}

export default function PostMoreSheetContent(props: PostMoreSheetContentProps) {
  const { postId, onClose } = props;
  const [step, setStep] = useState<MoreStep>("menu");

  const handleSelect = useCallback(
    (action: MoreAction) => {
      if (action === "report") {
        setStep("report");
        return;
      }
      Clipboard.setString(buildPostLink(postId));
      onClose();
      toast.success("링크를 복사했어요");
    },
    [onClose, postId]
  );

  if (step === "report") {
    return <ReportSheetContent postId={postId} onClose={onClose} />;
  }

  const items: Array<SheetListItem<MoreAction>> = [
    { value: "report", label: "게시물 신고" },
    { value: "copyLink", label: "링크 복사" },
  ];

  return <SheetList items={items} mode="navigate" onSelect={handleSelect} />;
}
