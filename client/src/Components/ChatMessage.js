import React from "react";
import { javi, chatgpt } from "../assets/images";

export default function ChatMessage({ message, user }) {
  return (
    <div
      className={`w-full ${user === "javi" ? "bg-[#343541]" : "bg-[#444654]"}`}
    >
      <div className="flex flex-row items-center justify-start mx-auto p-6 max-w-5xl">
        <div className="w-1/4 flex justify-center">
          <img
            className="rounded-full w-[40px] h-[40px] overflow-hidden"
            src={user === "javi" ? javi : chatgpt}
            alt="Not Found"
          />
        </div>
        <div className="w-3/4 ml-8 leading-8">{message}</div>
      </div>
    </div>
  );
}
