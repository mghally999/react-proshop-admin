import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { io as createIO } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const SocketCtx = createContext(null);

export function SocketProvider({ children }) {
  const qc = useQueryClient();
  const socketRef = useRef(null);

  useEffect(() => {
    // ✅ Vite proxy forwards /socket.io to http://localhost:4000
    const socket = createIO("/", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // Invalidate data on realtime events
    const onProductsChanged = () => qc.invalidateQueries({ queryKey: ["products"] });
    const onTxChanged = () => qc.invalidateQueries({ queryKey: ["transactions"] });
    const onInvoicesChanged = () => qc.invalidateQueries({ queryKey: ["invoices"] });
    const onNotifsChanged = () => qc.invalidateQueries({ queryKey: ["notifications"] });
    const onAuditChanged = () => qc.invalidateQueries({ queryKey: ["audit"] });
    const onDashboardChanged = () => qc.invalidateQueries({ queryKey: ["dashboard"] });
    const onReportsChanged = () => qc.invalidateQueries({ queryKey: ["reports"] });

    socket.on("products:changed", onProductsChanged);
    socket.on("transactions:changed", onTxChanged);
    socket.on("invoices:changed", onInvoicesChanged);
    socket.on("notifications:created", onNotifsChanged);
    socket.on("notifications:updated", onNotifsChanged);
    socket.on("audit:changed", onAuditChanged);
    socket.on("dashboard:changed", onDashboardChanged);
    socket.on("reports:changed", onReportsChanged);

    return () => {
      socket.off("products:changed", onProductsChanged);
      socket.off("transactions:changed", onTxChanged);
      socket.off("invoices:changed", onInvoicesChanged);
      socket.off("notifications:created", onNotifsChanged);
      socket.off("notifications:updated", onNotifsChanged);
      socket.off("audit:changed", onAuditChanged);
      socket.off("dashboard:changed", onDashboardChanged);
      socket.off("reports:changed", onReportsChanged);
      socket.disconnect();
    };
  }, [qc]);

  const value = useMemo(
    () => ({
      get socket() {
        return socketRef.current;
      },
    }),
    []
  );

  return <SocketCtx.Provider value={value}>{children}</SocketCtx.Provider>;
}

export function useSocket() {
  return useContext(SocketCtx);
}
