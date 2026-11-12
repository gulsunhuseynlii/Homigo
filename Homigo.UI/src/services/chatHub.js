import * as signalR from "@microsoft/signalr";

let connection = null;

const receiveMessageCallbacks = [];
const messagesReadCallbacks = [];
const unreadCountCallbacks = [];
const userTypingCallbacks = [];
const userStoppedTypingCallbacks = [];

export const startChatConnection = async () => {
  if (connection) return;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7121/chatHub", {
      accessTokenFactory: () => localStorage.getItem("token"),
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveMessage", (message) => {
    receiveMessageCallbacks.forEach((callback) => {
      callback(message);
    });
  });

  connection.on("MessagesRead", (orderId) => {
    messagesReadCallbacks.forEach((callback) => {
      callback(orderId);
    });
  });
connection.on("UserTyping", (orderId) => {
  userTypingCallbacks.forEach((callback) => {
    callback(orderId);
  });
});

connection.on("UserStoppedTyping", (orderId) => {
  userStoppedTypingCallbacks.forEach((callback) => {
    callback(orderId);
  });
});
  connection.on("UnreadCountChanged", (count) => {
    unreadCountCallbacks.forEach((callback) => {
      callback(count);
    });
  });

  await connection.start();

  console.log("Chat Connected");
};

export const onReceiveMessage = (callback) => {
  receiveMessageCallbacks.push(callback);

  return () => {
    const index = receiveMessageCallbacks.indexOf(callback);

    if (index !== -1) {
      receiveMessageCallbacks.splice(index, 1);
    }
  };
};

export const onMessagesRead = (callback) => {
  messagesReadCallbacks.push(callback);

  return () => {
    const index = messagesReadCallbacks.indexOf(callback);

    if (index !== -1) {
      messagesReadCallbacks.splice(index, 1);
    }
  };
};

export const onUnreadCountChanged = (callback) => {
  unreadCountCallbacks.push(callback);

  return () => {
    const index = unreadCountCallbacks.indexOf(callback);

    if (index !== -1) {
      unreadCountCallbacks.splice(index, 1);
    }
  };
};

export const getChatConnection = () => connection;
export const onUserTyping = (callback) => {
  userTypingCallbacks.push(callback);

  return () => {
    const index = userTypingCallbacks.indexOf(callback);

    if (index !== -1) {
      userTypingCallbacks.splice(index, 1);
    }
  };
};

export const onUserStoppedTyping = (callback) => {
  userStoppedTypingCallbacks.push(callback);

  return () => {
    const index = userStoppedTypingCallbacks.indexOf(callback);

    if (index !== -1) {
      userStoppedTypingCallbacks.splice(index, 1);
    }
  };
};