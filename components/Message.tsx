import React from "react";
import { useAuth } from "../context/AuthContext";
import { MessageObj } from "../types/Message";
import Avatar from "./Avatar";

interface MessageProps {
  message?: MessageObj;
  nextMessage?: MessageObj;
}

const Message = ({ message, nextMessage }: MessageProps) => {
  const { currentUser } = useAuth();

  const sent = message?.authorId === currentUser?.uid;
  const nextIsSent = message?.authorId === nextMessage?.authorId;

  return (
    <div className={`flex items-end ${sent ? "justify-end" : "justify-start"}`}>
      <div
        className={`order-${
          sent ? "1" : "2"
        } mx-2 max-w-[60%] break-words rounded-md p-2 ${
          sent
            ? "rounded-br-none bg-blue-400 text-white"
            : "rounded-bl-none bg-gray-300 text-gray-600"
        } ${nextIsSent && "mx-8"}`}
      >
        {message?.content}
      </div>
      {!nextIsSent && (
        <div className={`order-${sent ? "2" : 1}`}>
          <Avatar
            photoURL={message?.photoURL}
            displayName={message?.displayName}
            size={6}
          />
        </div>
      )}
    </div>
  );
};

export default Message;
