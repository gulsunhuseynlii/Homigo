import * as signalR from "@microsoft/signalr";

let connection = null;

export const startChatConnection = async () => {
  if (connection) return;

  const token = localStorage.getItem("token");

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7121/chatHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  await connection.start();

  console.log("Chat Connected");
};

export const onReceiveMessage = (callback) => {
  connection?.off("ReceiveMessage");
  connection?.on("ReceiveMessage", callback);

  return () => connection?.off("ReceiveMessage", callback);
};

export const onMessagesRead = (callback) => {
  connection?.off("MessagesRead");

  connection?.on("MessagesRead", (orderId) => {
    console.log("🔥 MessagesRead received:", orderId);

    callback(orderId);
  });

  return () => connection?.off("MessagesRead");
};

export const getChatConnection = () => connection;