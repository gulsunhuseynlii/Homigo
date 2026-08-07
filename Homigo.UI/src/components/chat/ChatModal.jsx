import { useEffect, useRef, useState } from "react";
import {
  getMessages,
  sendMessage,
} from "../../services/chatService";

import {
  onReceiveMessage,
  onMessagesRead,
} from "../../services/chatHub";

function ChatModal({ orderId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  const loadMessages = async () => {
    try {
      const data = await getMessages(orderId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMessages();

    const unsubscribeMessage = onReceiveMessage(async (message) => {
      if (message.orderId !== orderId) return;

      await loadMessages();
    });

    const unsubscribeRead = onMessagesRead((readOrderId) => {
      if (readOrderId !== orderId) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.isMine
            ? {
                ...m,
                isRead: true,
              }
            : m
        )
      );
    });

    return () => {
      unsubscribeMessage?.();
      unsubscribeRead?.();
    };
  }, [orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const message = text;

    setText("");

    try {
      await sendMessage({
        orderId,
        message,
      });

      await loadMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="flex h-[600px] w-[420px] flex-col rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-4">

          <div>
            <h2 className="text-xl font-bold">
              Chat
            </h2>

            <p className="text-sm text-slate-500">
              Order #{orderId}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✖
          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-4">

          {messages.length === 0 && (
            <div className="mt-10 text-center text-slate-400">
              No messages yet.
            </div>
          )}

          <div className="space-y-3">

            {messages.map((m) => (

              <div
                key={m.id}
                className={`flex ${
                  m.isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    m.isMine
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-black"
                  }`}
                >

                  <p>{m.message}</p>

                  <div
                    className={`mt-2 flex items-center gap-2 text-xs ${
                      m.isMine
                        ? "text-blue-100"
                        : "text-slate-500"
                    }`}
                  >

                    <span>
                      {new Date(
                        m.createdAt + "Z"
                      ).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {m.isMine && (
                      <span>
                        {m.isRead
                          ? "✓✓"
                          : "✓"}
                      </span>
                    )}

                  </div>

                </div>

              </div>

            ))}

            <div ref={bottomRef}></div>

          </div>

        </div>

        <div className="flex gap-2 border-t p-4">

          <input
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Write a message..."
            className="flex-1 rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
          />

          <button
            onClick={handleSend}
            className="rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatModal;