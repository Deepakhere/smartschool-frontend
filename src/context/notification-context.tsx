import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";

import { useAuth } from "./auth-context";
import {
  useGetMyNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "./service/notifications";
import { INotification } from "../types";
import { USER_ACCESS_KEY } from "../utils";

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { organizationId } = useParams();
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState<INotification[]>([]);

  const { data, isLoading } = useGetMyNotifications(organizationId);
  const markReadMutation = useMarkNotificationRead(organizationId);
  const markAllReadMutation = useMarkAllNotificationsRead(organizationId);

  // server list is the source of truth once fetched; live-pushed items only
  // fill the gap before the first fetch resolves (or a refetch reconciles them away)
  useEffect(() => {
    if (data) setLiveNotifications([]);
  }, [data]);

  useEffect(() => {
    if (!user?.id) return;

    const token = Cookies.get(USER_ACCESS_KEY.TOKEN);
    if (!token) return;

    const socket: Socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      withCredentials: true,
    });

    socket.on("notification:new", (notification: INotification) => {
      setLiveNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  const fetchedNotifications = data?.items || [];
  const notifications = [
    ...liveNotifications.filter((live) => !fetchedNotifications.some((n) => n.id === live.id)),
    ...fetchedNotifications,
  ];
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        isSheetOpen,
        openSheet: () => setIsSheetOpen(true),
        closeSheet: () => setIsSheetOpen(false),
        markAsRead: (notificationId: string) => markReadMutation.mutate(notificationId),
        markAllAsRead: () => markAllReadMutation.mutate(),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
