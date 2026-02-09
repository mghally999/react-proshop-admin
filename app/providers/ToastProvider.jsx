// src/app/providers/ToastProvider.jsx
import Toast from "../../shared/ui/feedback/Toast.jsx";

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toast />
    </>
  );
}
