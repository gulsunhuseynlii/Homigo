import api from "../api/axios";

export const getMessages = async (orderId) => {
  const { data } = await api.get(`/chat/${orderId}`);
  return data;
};


export const sendMessage = async ({
  orderId,
  message,
  file,
}) => {

  const formData = new FormData();

  formData.append(
    "OrderId",
    orderId
  );

  if (message) {
    formData.append(
      "Message",
      message
    );
  }

  if (file) {
    formData.append(
      "File",
      file
    );
  }


  const { data } = await api.post(
    "/chat",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};


export const getUnreadCount = async () => {
  const { data } = await api.get(
    "/chat/unread-count"
  );

  return data;
};


export const getUnreadCountByOrder = async (orderId) => {
  const { data } = await api.get(
    `/chat/${orderId}/unread-count`
  );

  return data;
};