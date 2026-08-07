import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

import { startConnection } from "./services/notificationService";
import { startChatConnection } from "./services/chatHub";

function App() {
  useEffect(() => {
    const connect = async () => {
      try {
        await startConnection();
        await startChatConnection();
      } catch (err) {
        console.error(err);
      }
    };

    connect();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
}

export default App;