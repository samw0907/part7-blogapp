import React from "react";
import { useNotification } from "./NotificationContext";

const NotificationDisplay = () => {
  const { notification } = useNotification();

  if (!notification.message) {
    return null;
  }

  const notificationStyle = {
    color: notification.type === "error" ? "red" : "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return (
    <div style={notificationStyle}>
      {notification.message}
    </div>
  );
};

export default NotificationDisplay;