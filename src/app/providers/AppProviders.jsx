import ThemeProvider from "./ThemeProvider.jsx";
import QueryProvider from "./QueryProvider.jsx";
import ToastProvider from "./ToastProvider.jsx";
import AuthProvider from "./AuthProvider.jsx";
import { SocketProvider } from "./SocketProvider.jsx";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <SocketProvider>
            <ToastProvider>{children}</ToastProvider>
          </SocketProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
