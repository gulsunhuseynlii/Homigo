import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { askAi } from "../../services/aiService";

function AiAssistant() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "👋 Salam! Mən Homigo AI köməkçisiyəm. Problemini mənə danış, sənə uyğun xidməti tapmağa kömək edim.",
    },
  ]);

  const handleSend = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const data = await askAi(text);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: data.message,
          recommendations: data.recommendations || [],
        },
      ]);
    } catch (error) {
      console.error("AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "😕 Bağışlayın, hazırda AI köməkçisi ilə əlaqə yaratmaq mümkün olmadı. Zəhmət olmasa bir az sonra yenidən cəhd edin.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* AI BUTTON */}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-orange-500 px-5 py-4 font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-orange-600"
        >
          <span className="text-xl">✨</span>

          <span className="hidden sm:inline">
            Homigo AI
          </span>
        </button>
      )}

      {/* CHAT */}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

          {/* HEADER */}

          <div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-xl">
                ✨
              </div>

              <div>
                <h3 className="font-bold">
                  Homigo AI
                </h3>

                <p className="text-xs text-slate-400">
                  Your service assistant
                </p>
              </div>

            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 transition hover:bg-white/10"
            >
              <FiX size={22} />
            </button>

          </div>

          {/* MESSAGES */}

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">

            {messages.map((item, index) => (

              <div
                key={index}
                className={
                  item.type === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >

                <div
                  className={
                    item.type === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-orange-500 px-4 py-3 text-sm text-white"
                      : "max-w-[90%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                  }
                >

                  <p className="leading-6">
                    {item.text}
                  </p>

                  {/* RECOMMENDED SERVICES */}

                  {item.recommendations?.length > 0 && (

                    <div className="mt-4 space-y-3">

                      {item.recommendations.map((service) => (

                        <div
                          key={service.id}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                        >

                          {service.imageUrl && (
                            <img
                              src={`https://localhost:7121${service.imageUrl}`}
                              alt={service.name}
                              className="h-28 w-full object-cover"
                            />
                          )}

                          <div className="p-3">

                            <h4 className="font-bold text-slate-900">
                              {service.name}
                            </h4>

                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                              {service.description}
                            </p>

                            <div className="mt-3 flex items-center justify-between">

                              <span className="font-bold text-orange-500">
                                From {service.basePrice} $
                              </span>

                              <button
                                onClick={() =>
                                  navigate(`/services/${service.id}`)
                                }
                                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-500"
                              >
                                View Service
                              </button>

                            </div>

                          </div>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              </div>

            ))}

            {/* LOADING */}

            {loading && (
              <div className="flex justify-start">

                <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">

                  <div className="flex gap-1">

                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />

                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "150ms" }}
                    />

                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "300ms" }}
                    />

                  </div>

                </div>

              </div>
            )}

          </div>

          {/* INPUT */}

          <div className="border-t border-slate-200 bg-white p-3">

            <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-slate-50 p-2">

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                placeholder="Problemini yaz..."
                className="max-h-24 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
              />

              <button
                onClick={handleSend}
                disabled={!message.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiSend size={18} />
              </button>

            </div>

            <p className="mt-2 text-center text-[10px] text-slate-400">
              Homigo AI can make mistakes. Check service details before booking.
            </p>

          </div>

        </div>
      )}
    </>
  );
}

export default AiAssistant;