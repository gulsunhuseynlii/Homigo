import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";

let connection = null;
let notificationCallback = null;

export const startConnection = async () => {
  // Əgər artıq connection varsa, yenisini yaratma
  if (
    connection &&
    connection.state === signalR.HubConnectionState.Connected
  ) {
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7121/notificationHub", {
      accessTokenFactory: () =>
        localStorage.getItem("token") || "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveNotification", (notification) => {
    toast.success(notification.message);
    console.log(notification);

    if (notificationCallback) {
      notificationCallback(notification);
    }
  });

  try {
    await connection.start();

    console.log("SignalR Connected");
  } catch (error) {
    console.error("SignalR Connection Error:", error);
  }
};

export const onReceiveNotification = (callback) => {
  notificationCallback = callback;

  // cleanup üçün unsubscribe funksiyası qaytarır
  return () => {
    notificationCallback = null;
  };
};

export const stopConnection = async () => {
  notificationCallback = null;

  if (connection) {
    try {
      await connection.stop();
      console.log("SignalR Disconnected");
    } catch (error) {
      console.error("SignalR Disconnect Error:", error);
    }

    connection = null;
  }
};

export const getConnection = () => connection;