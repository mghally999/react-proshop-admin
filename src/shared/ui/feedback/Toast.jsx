// src/shared/ui/feedback/Toast.jsx
import toast, { Toaster } from "react-hot-toast";

export function toastSuccess(message, opts) {
  return toast.success(message, opts);
}

export function toastError(message, opts) {
  return toast.error(message, opts);
}

export function toastLoading(message, opts) {
  return toast.loading(message, opts);
}

export function toastDismiss(id) {
  toast.dismiss(id);
}

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 3000,
        className: "ps-toast",
        success: { className: "ps-toast ps-toast--success" },
        error: { className: "ps-toast ps-toast--error" },
        loading: { className: "ps-toast ps-toast--loading" },
      }}
    />
  );
}
