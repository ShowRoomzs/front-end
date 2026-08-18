import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import SheetList, { SheetListItem } from "@/common/components/SheetList/SheetList";
import TextArea from "@/common/components/TextArea/TextArea";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
import { useGetReportReasons } from "@/features/post/hooks/useGetReportReasons";
import { useReportPostMutation } from "@/features/post/hooks/useReportPostMutation";
import { PostReportReasonCode } from "@/features/post/types/post";

/**
 * 게시물 신고 시트 — 카드 헤더의 ⋯에서 열린다.
 *
 * 사유 목록은 서버가 내려준 것을 그대로 쓴다. 앱이 문구를 들고 있으면 운영정책이 바뀔 때마다
 * 앱을 다시 배포해야 한다. 기타는 상세 설명 없이 접수하지 않는다 — 운영자가 무엇을 보라는
 * 것인지 알 수 없는 신고는 조치로 이어지지 않고 대기열만 채운다.
 */
interface ReportSheetContentProps {
  postId: number;
  onClose: () => void;
}

const DETAIL_MAX_LENGTH = 500;

export default function ReportSheetContent(props: ReportSheetContentProps) {
  const { postId, onClose } = props;
  const { data: reasons } = useGetReportReasons();
  const { mutate: report, isPending } = useReportPostMutation();

  const [detailReason, setDetailReason] = useState<PostReportReasonCode | null>(null);
  const [detail, setDetail] = useState("");

  const submit = (reasonCode: PostReportReasonCode, reasonDetail?: string) => {
    report(
      { postId, body: { reasonCode, reasonDetail } },
      {
        onSuccess: () => {
          onClose();
          toast.success("신고가 접수되었어요");
        },
        onError: () => toast.error("신고를 접수하지 못했어요. 잠시 후 다시 시도해 주세요"),
      }
    );
  };

  const handleSelect = (code: string) => {
    const reason = reasons?.find(item => item.code === code);

    if (!reason) {
      return;
    }
    if (reason.detailRequired) {
      setDetailReason(reason.code);
      return;
    }
    submit(reason.code);
  };

  if (detailReason) {
    const canSubmit = detail.trim().length > 0 && !isPending;

    return (
      <View className="px-20 pb-24">
        <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 21 }} className="pb-10">
          어떤 점이 문제인지 알려주세요
        </Typography>
        <Typography variant="caption" style={{ lineHeight: 20 }} className="pb-14 text-gray55">
          운영자가 무엇을 확인해야 하는지 적어 주시면 검토가 빨라집니다.
        </Typography>

        <TextArea
          value={detail}
          onChangeText={setDetail}
          maxLength={DETAIL_MAX_LENGTH}
          placeholder="예) 광고 표시 없이 협찬 상품을 소개하고 있어요"
        />

        <TouchableOpacity
          onPress={() => submit(detailReason, detail.trim())}
          disabled={!canSubmit}
          activeOpacity={0.8}
          className="mt-16"
        >
          <View
            className={`h-52 flex-row items-center justify-center rounded-base ${
              canSubmit ? "bg-rose" : "bg-fill"
            }`}
          >
            <Typography variant="buttonPrimary" className={canSubmit ? "text-white" : "text-gray62"}>
              신고하기
            </Typography>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  const items: Array<SheetListItem<string>> = (reasons ?? []).map(reason => ({
    value: reason.code,
    label: reason.label,
  }));

  return (
    <SheetList
      title="이 게시물을 신고하는 이유를 알려주세요"
      description="신고는 익명으로 접수되며, 검토까지 최대 24시간이 걸립니다."
      items={items}
      onSelect={handleSelect}
      footer={
        <TouchableOpacity onPress={onClose} activeOpacity={0.6} className="px-20 py-15">
          <Typography variant="menuPassive" className="text-gray45">
            취소
          </Typography>
        </TouchableOpacity>
      }
    />
  );
}
