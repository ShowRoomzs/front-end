import { AxiosError } from "axios";
import { TouchableOpacity, View } from "react-native";

import { WifiOffIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";

/**
 * 전체 오류 — 연결 실패(디자인 시스템 §07).
 *
 * 데이터를 **아직 한 번도 못 받은 화면**에만 쓴다. 이미 내용이 떠 있는데 갱신만 실패했다면
 * 토스트로 알리고 기존 내용을 지우지 않는다. 모달을 띄우지 않고 제자리에서 알린다.
 *
 * - 문구는 원인을 단정하지 않는다(「서버 오류」 대신 「연결이 원활하지 않아요」).
 * - [다시 시도]는 중립 외곽선 — 오류 복구는 권장 액션이 아니라 당연한 재시도라 로즈를 쓰지 않는다.
 * - 서버가 답은 했는데 4xx로 거절한 경우(없는 주문 등)는 연결 문제가 아니다 — 서버 문구를 그대로
 *   제목에 두고, 다시 시도해도 같은 답이라 버튼을 두지 않는다.
 */
interface ErrorStateProps {
  error?: unknown;
  onRetry?: () => void;
  /** 화면에 이 안내밖에 없을 때 남는 세로 공간 가운데에 둔다 */
  fill?: boolean;
  /** 아래에 겹쳐 뜨는 고정 버튼 높이 — 그만큼 빼고 가운데를 잡는다 */
  insetBottom?: number;
}

const CONNECTION_TITLE = "연결이 원활하지 않아요";
const CONNECTION_DESCRIPTION = "네트워크 상태를 확인하고\n다시 시도해 주세요";

/** 응답이 아예 없거나(네트워크 · 시간 초과) 5xx — 다시 시도로 풀릴 수 있는 실패 */
export function isConnectionError(error: unknown) {
  const status = (error as AxiosError | undefined)?.response?.status;

  return status === undefined || status >= 500;
}

export default function ErrorState(props: ErrorStateProps) {
  const { error, onRetry, fill = true, insetBottom = 0 } = props;
  const isConnection = isConnectionError(error);
  const serverMessage = (error as AxiosError<{ message?: string }> | undefined)?.response?.data?.message;

  const title = isConnection ? CONNECTION_TITLE : serverMessage || "내용을 불러오지 못했어요";
  const description = isConnection ? CONNECTION_DESCRIPTION : undefined;
  const canRetry = isConnection && !!onRetry;

  return (
    <View
      className={fill ? "flex-1 items-center justify-center px-40" : "items-center px-40 py-26"}
      style={insetBottom ? { paddingBottom: insetBottom } : undefined}
    >
      <WifiOffIcon />

      <Typography
        style={{ fontSize: 15, fontWeight: "600", lineHeight: 22.5, marginTop: 16 }}
        className="text-center text-ink"
      >
        {title}
      </Typography>

      {!!description && (
        <Typography
          style={{ fontSize: 12.5, lineHeight: 21.25, marginTop: 6 }}
          className="text-center text-gray55"
        >
          {description}
        </Typography>
      )}

      {canRetry && (
        <TouchableOpacity onPress={onRetry} activeOpacity={0.55} style={{ marginTop: 18 }}>
          <View className="h-44 flex-row items-center rounded-base border border-borderButton px-22">
            <Typography
              style={{ fontSize: 13.5, fontWeight: "600", lineHeight: 13.5 }}
              className="text-ink76"
            >
              다시 시도
            </Typography>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
