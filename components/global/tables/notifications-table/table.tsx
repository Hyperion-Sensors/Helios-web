import React, { useEffect, useState } from "react";
import NotificationCard from "../../notifications/notification_card";
import { get_recent_notifications } from "hooks/endpoints/notification_services";
import HeaderTitle from "@/Global/misc/card-search-title";

export default function NotificationsTable() {
  const [notifications, setNotifications] = useState([]);
  const [notificationElements, setNotificationElements] = useState<any>([
    <></>,
  ]);

  useEffect(() => {
    const get_notifications = async () => {
      const result = await get_recent_notifications();
      if (result) {
        setNotifications(result.data);
      }
    };

    get_notifications();

    const interval = setInterval(() => {
      get_notifications();
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setNotificationElements(
      notifications.map((notification, index) => {
        return (
          <div key={"asset" + index}>
            <NotificationCard
              id={notification.id}
              message={notification.message}
              level={notification.alert_level}
              timestamp={notification.time}
            />
          </div>
        );
      })
    );
  }, [notifications]);
  return (
    <div
      id="notifications_table"
      className="flex flex-col h-full overflow-y-auto"
    >
      <HeaderTitle
        content={"Notifications"}
        description={"Recent Notifications from all systems"}
      />
      <ul className=" overflow-x-hidden  grow scrollbar bg-primary overflow-y-auto">
        {notificationElements}
        <h3 className="text-center text-text w-full place-self-center text-sm">
          End of Overview Notifications
        </h3>
        <p className="text-center text-text w-full place-self-center text-xs">
          See all notifications here
        </p>
      </ul>
    </div>
  );
}
