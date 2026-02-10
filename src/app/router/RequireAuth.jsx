import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@app/providers/AuthProvider.jsx";

export default function RequireAuth({ children }) {
  const { isAuthed, booting } = useAuth();
  const location = useLocation();

  if (booting) return null; // or Skeleton

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
