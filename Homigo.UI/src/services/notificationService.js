import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";

let connection = null;
let notificationCallback = null;

export const startConnection = async () => {
  const token = localStorage.getItem("token");

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7121/notificationHub", {
      accessTokenFactory: () => token,
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

  await connection.start();

  console.log("SignalR Connected");
};

export const onReceiveNotification = (callback) => {
  notificationCallback = callback;
};

export const getConnection = () => connection;