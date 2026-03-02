import { createContext, ReactNode, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

export interface ModalButton {
  label: string;
  variant?: "primary" | "outline";
  onPress?: () => void;
}

export interface ModalConfig {
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
