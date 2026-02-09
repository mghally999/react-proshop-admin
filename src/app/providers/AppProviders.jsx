import ThemeProvider from "./ThemeProvider.jsx";
import QueryProvider from "./QueryProvider.jsx";
import ToastProvider from "./ToastProvider.jsx";
import AuthProvider from "./AuthProvider.jsx";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
