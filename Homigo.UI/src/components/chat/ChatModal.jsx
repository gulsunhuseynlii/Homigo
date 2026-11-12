import { useEffect, useRef, useState } from "react";

import {
  getMessages,
  sendMessage,
} from "../../services/chatService";

import {
  onReceiveMessage,
  onMessagesRead,
  onUserTyping,
  onUserStoppedTyping,
  getChatConnection,
} from "../../services/chatHub";


function ChatModal({ orderId, onClose }) {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
const [previewImage, setPreviewImage] = useState(null);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);


  const loadMessages = async () => {
    try {
      const data = await getMessages(orderId);
      setMessages(data);
    }
    catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {

    loadMessages();


    const unsubscribeMessage =
      onReceiveMessage(async (message) => {

        if (message.orderId !== orderId)
          return;

        await loadMessages();
      });



    const unsubscribeRead =
      onMessagesRead((readOrderId) => {

        if (readOrderId !== orderId)
          return;


        setMessages(prev =>
          prev.map(m =>
            m.isMine
              ? {
                  ...m,
                  isRead: true
                }
              : m
          )
        );

      });



    const unsubscribeTyping =
      onUserTyping((typingOrderId) => {

        if (typingOrderId !== orderId)
          return;

        setIsTyping(true);

      });



    const unsubscribeStoppedTyping =
      onUserStoppedTyping((typingOrderId) => {

        if (typingOrderId !== orderId)
          return;

        setIsTyping(false);

      });



    return () => {

      unsubscribeMessage?.();
      unsubscribeRead?.();
      unsubscribeTyping?.();
      unsubscribeStoppedTyping?.();


      if (typingTimeoutRef.current)
        clearTimeout(typingTimeoutRef.current);


      const connection = getChatConnection();


      if (connection) {

        connection
          .invoke(
            "StopTyping",
            orderId
          )
          .catch(() => {});

      }

    };


  }, [orderId]);



  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages, isTyping]);





  const handleTyping = (value) => {

    setText(value);


    const connection = getChatConnection();


    if (!connection)
      return;


    connection
      .invoke(
        "StartTyping",
        orderId
      )
      .catch(() => {});



    if (typingTimeoutRef.current)
      clearTimeout(
        typingTimeoutRef.current
      );


    typingTimeoutRef.current =
      setTimeout(() => {

        connection
          .invoke(
            "StopTyping",
            orderId
          )
          .catch(() => {});


      },1200);

  };






  const handleSend = async () => {


    if (!text.trim() && !selectedFile)
      return;



    try {

      await sendMessage({

        orderId,

        message: text,

        file: selectedFile

      });



      setText("");

      setSelectedFile(null);



      await loadMessages();

    }

    catch(err){

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


          <div className="space-y-3">


            {messages.map((m)=>(


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



                  {m.message && (
                    <p>
                      {m.message}
                    </p>
                  )}



             {m.imageUrl && (

  <img
    src={`https://localhost:7121${m.imageUrl}`}
    alt="sent"
    onClick={() =>
      setPreviewImage(
        `https://localhost:7121${m.imageUrl}`
      )
    }
    className="mt-2 max-h-60 cursor-pointer rounded-lg object-cover transition hover:opacity-80"
  />

)}





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
                      ).toLocaleTimeString(
                        "en-GB",
                        {
                          hour:"2-digit",
                          minute:"2-digit"
                        }
                      )}

                    </span>



                    {m.isMine && (

                      <span>
                        {
                          m.isRead
                          ? "✓✓"
                          : "✓"
                        }
                      </span>

                    )}


                  </div>



                </div>



              </div>


            ))}




            {isTyping && (

              <div className="flex justify-start">

                <div className="rounded-2xl bg-slate-200 px-4 py-3 text-sm text-slate-500">

                  typing...

                </div>

              </div>

            )}





            <div ref={bottomRef}/>


          </div>


        </div>






        <div className="flex gap-2 border-t p-4">



          <label className="cursor-pointer rounded-xl bg-slate-200 px-4 py-3">

            📎


            <input

              type="file"

              accept="image/*"

              hidden


              onChange={(e)=>{

                setSelectedFile(
                  e.target.files[0]
                );

              }}

            />


          </label>





          <input

            value={text}


            onChange={(e)=>
              handleTyping(
                e.target.value
              )
            }


            onKeyDown={(e)=>{

              if(e.key==="Enter")
                handleSend();

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



        {selectedFile && (

          <div className="px-4 pb-3 text-sm text-slate-500">

            Selected: {selectedFile.name}

          </div>

        )}



      </div>

{previewImage && (

  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
    onClick={() => setPreviewImage(null)}
  >

    <img
      src={previewImage}
      alt="preview"
      className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
      onClick={(e) =>
        e.stopPropagation()
      }
    />

    <button
      onClick={() => setPreviewImage(null)}
      className="absolute right-8 top-8 text-4xl text-white"
    >
      ✖
    </button>

  </div>

)}
    </div>

  );

}


export default ChatModal;