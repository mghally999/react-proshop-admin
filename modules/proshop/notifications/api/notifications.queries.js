import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "./notifications.service.js";

export function useNotifications(params = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationsService.list(params),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
