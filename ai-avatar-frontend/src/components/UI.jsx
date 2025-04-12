import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

export const UI = ({ hidden, gender, setGender, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { listening, startListning, stopListening, text } =
    useSpeechRecognition();

  const handleMicClick = () => {
    if (listening) {
      stopListening();
    } else {
      startListning();
    }
  };

  useEffect(() => {
    if (!text) {
      return;
    }

    chat(text, gender);
    stopListening();
  }, [text]);

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text, gender);
      input.current.value = "";
    }
  };

  const toggleGender = () => {
    setGender(gender === "female" ? "male" : "female");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (hidden) {
    return null;
  }

  return (
    <>
      {/* Sidebar toggle button */}
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-30 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
      >
        {sidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>

      {/* Sessions sidebar */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-96 bg-gray-900 text-white p-8 z-20 overflow-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl mt-10 font-bold">SESSIONS</h1>
          {/* <button 
            onClick={toggleSidebar}
            className="text-white text-3xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button> */}
        </div>
        <div className="flex flex-col gap-4 text-xl">
          <button className="text-left font-bold">SESSIONS 1</button>
          <button className="text-left font-bold">SESSIONS 2</button>
          <button className="text-left font-bold">SESSIONS 3</button>
        </div>
      </div>

      {/* Main UI overlay */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="w-full flex flex-col items-end justify-center gap-4">
          <button
            onClick={toggleGender}
            className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white p-4 rounded-full"
          >
            {gender === "female" ? "Switch to Male" : "Switch to Female"}
          </button>
          <button
            onClick={handleMicClick}
            className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white p-4 rounded-full"
          >
            {listening ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white p-4 rounded-full"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <input
            className="w-full text-white placeholder:text-gray-400 p-4 rounded-full bg-opacity-20 bg-gray-800 backdrop-blur-md border border-gray-700"
            placeholder="Type a message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            disabled={loading || message}
            onClick={sendMessage}
            className={`bg-red-600 hover:bg-red-700 text-white p-4 px-6 font-semibold uppercase rounded-full flex items-center ${
              loading || message ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};