import { createContext, ReactNode, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

export interface ModalButton {
  label: string;
  variant?: "primary" | "outline";
  onPress?: () => void;
}

export interface ModalConfig {
  /**
   * 제목 위에 놓이는 아이콘. 원형 배경 안에 넣어 그린다 —
   * 완료(중립 회색)·대기(로즈 틴트)처럼 성격을 색으로 먼저 알린다.
   */
  icon?: ReactNode;
  /** 아이콘 원의 배경색. 지정하지 않으면 중립(#F4F4F5) */
  iconBackgroundColor?: string;
  title?: string;
  message?: string | ReactNode;
  buttons?: Array<ModalButton>;
  closable?: boolean;
  onClose?: () => void;
  centered?: boolean;
}

export interface ModalContextValue {
  show: (config: ModalConfig) => void;
  hide: () => void;
}

export interface ModalStateContextValue {
  currentModal: ModalConfig | null;
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
}

export const ModalContext = createContext<ModalContextValue | null>(null);
export const ModalStateContext = createContext<ModalStateContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
}

export function useModalState() {
  const context = useContext(ModalStateContext);

  if (!context) {
    throw new Error("useModalState must be used within a ModalProvider");
  }

  return context;
}
