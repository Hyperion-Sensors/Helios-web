import React, { useEffect, useState } from "react";
import NotificationCard from "./notification_card";
import { get_recent_notifications } from "hooks/endpoints/notification_services";
import moment, { Moment } from "moment";
import InfoCard from "../custom/info_card";

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
          <>
            <NotificationCard
              key={index}
              id={notification.id}
              message={notification.message}
              level={notification.alert_level}
              timestamp={notification.time}
            />
            <hr className="border border-accent-light" />
          </>
        );
      })
    );
  }, [notifications]);

  return (
    <div id="notifications_table" className="flex flex-col h-full ">
      <div className="mb-1 flex flex-row">
        <h4 className="text-lg  font-medium ">Recent Notifications</h4>

        <div className="h-5 w-5 group">
          <InfoCard
            title={"Notifications:"}
            description={
              "See the most recent summary of important notifications here. Click on a notification to see more details."
            }
            card_styles={
              "p-3 hidden group-hover:flex-grow text-center group-hover:block absolute z-10  bg-primary rounded-md shadow-lg top-5 -left-20 align-center "
            }
          />
        </div>
      </div>

      <ul className=" overflow-x-hidden  grow scrollbar bg-primary border border-accent-light rounded-md overflow-y-auto">
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
