import { ReactNode } from "react";

import type { ToastConfig } from "./context";

type ToastHandler = {
  show: (config: ToastConfig | string) => void;
  hide: () => void;
};

let handler: ToastHandler | null = null;

export const toast = {
  show: (config: ToastConfig | string) => {
    if (handler) {
      handler.show(config);
    }
  },
  hide: () => {
    if (handler) {
      handler.hide();
    }
  },
  info: (message: ReactNode, options?: Omit<ToastConfig, "message" | "type">) => {
    toast.show({ message, type: "info", ...options });
  },
  success: (message: ReactNode, options?: Omit<ToastConfig, "message" | "type">) => {
    toast.show({ message, type: "success", ...options });
  },
  error: (message: ReactNode, options?: Omit<ToastConfig, "message" | "type">) => {
    toast.show({ message, type: "error", ...options });
  },
  warning: (message: ReactNode, options?: Omit<ToastConfig, "message" | "type">) => {
    toast.show({ message, type: "warning", ...options });
  },
  point: (message: ReactNode, options?: Omit<ToastConfig, "message" | "type">) => {
    toast.show({ message, type: "point", ...options });
  },
};

export function registerToastHandler(newHandler: ToastHandler) {
  handler = newHandler;
}

export function unregisterToastHandler() {
  handler = null;
}
