import PageHeader from "@/app/layout/PageHeader.jsx";
import Skeleton from "@shared/ui/composites/Skeleton.jsx";
import EmptyState from "@shared/ui/composites/EmptyState.jsx";
import Button from "@shared/ui/primitives/Button.jsx";

import { useNotifications, useMarkNotificationRead } from "../../api/notifications.queries.js";
import s from "@modules/proshop/notifications/styles/notifications.module.css";

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications({ page: 1, limit: 50 });
  const markRead = useMarkNotificationRead();

  if (isLoading) return <Skeleton rows={6} />;

  const items = data?.items || [];

  return (
    <>
      <PageHeader title="Notifications" />
      {items.length === 0 ? (
        <EmptyState title="You're all caught up" description="No notifications yet." />
      ) : (
        <div className={s.list}>
          {items.map((n) => (
            <div key={n.id} className={`${s.item} ${n.read ? s.read : s.unread}`}>
              <div className={s.row}>
                <div>
                  <div className={s.title}>{n.title}</div>
                  <div className={s.msg}>{n.message}</div>
                </div>
                <div className={s.actions}>
                  <div className={s.time}>{new Date(n.createdAt).toLocaleString()}</div>
                  {!n.read && (
                    <Button size="sm" variant="ghost" onClick={() => markRead.mutate(n.id)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
