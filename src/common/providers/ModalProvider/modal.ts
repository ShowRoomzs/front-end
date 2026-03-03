import type { ModalConfig } from "./context";
import type { ReactNode } from "react";

type ModalHandler = {
  show: (config: ModalConfig) => void;
  hide: () => void;
};

let handler: ModalHandler | null = null;

interface AlertConfig {
  title?: string;
  message?: string | ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  closable?: boolean;
  onClose?: () => void;
  centered?: boolean;
}

interface ConfirmConfig {
  title?: string;
  message?: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  centered?: boolean;
}

export const modal = {
  show: (config: ModalConfig) => {
    if (handler) {
      handler.show(config);
    }
  },
  hide: () => {
    if (handler) {
      handler.hide();
    }
  },
  alert: (config: AlertConfig) => {
    const { title, message, confirmLabel = "확인", onConfirm, closable = false, onClose, centered } = config;

    modal.show({
      title,
      message,
      closable,
      onClose,
      centered,
      buttons: [
        {
          label: confirmLabel,
          variant: "primary",
          onPress: () => {
            modal.hide();
            onConfirm?.();
          },
        },
      ],
    });
  },
  confirm: (config: ConfirmConfig) => {
    const {
      title,
      message,
      confirmLabel = "확인",
      cancelLabel = "취소",
      onConfirm,
      onCancel,
      centered,
    } = config;

    modal.show({
      title,
      message,
      centered,
      buttons: [
        {
          label: cancelLabel,
          variant: "outline",
          onPress: () => {
            modal.hide();
            onCancel?.();
          },
        },
        {
          label: confirmLabel,
          variant: "primary",
          onPress: () => {
            modal.hide();
            onConfirm?.();
          },
        },
      ],
    });
  },
};

export function registerModalHandler(newHandler: ModalHandler) {
  handler = newHandler;
}

export function unregisterModalHandler() {
  handler = null;
}
