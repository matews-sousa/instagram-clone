import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ChatDoc, MessageObj } from "../types/Message";
import { ProfileUser } from "../types/User";
import { db } from "../utils/firebase";
import getUserData from "../utils/getUserData";
import Message from "./Message";
import { BiSend } from "react-icons/bi";

interface ChatProps {
  userSelected: Partial<ProfileUser>;
}

const Chat = ({ userSelected }: ChatProps) => {
  const [messages, setMessages] = useState<MessageObj[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [messageContent, setMessageContent] = useState("");
  const chatBottom = useRef<null | HTMLDivElement>(null);
  const { currentUser } = useAuth();

  const sendMessage = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newMessage = {
      authorId: currentUser?.uid,
      content: messageContent,
      createdAt: Timestamp.now(),
    };
    if (currentChatId) {
      const chatRef = doc(db, "chats", currentChatId);
      const docSnap = await getDoc(chatRef);
      const chatData = docSnap.data();
      const newChatData = {
        ...chatData,
        messages: [
          ...chatData?.messages,
          {
            ...newMessage,
          },
        ],
      };
      await setDoc(chatRef, newChatData);
    } else {
      const newChat = {
        users: [currentUser?.uid, userSelected.id],
        messages: [{ ...newMessage }],
      };
      await addDoc(collection(db, "chats"), newChat);
    }
    setMessageContent("");
    chatBottom!.current!.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", userSelected.id),
    );
    const unsub = onSnapshot(q, async (querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        const chatData = querySnapshot.docs[0].data() as ChatDoc;
        if (chatData && chatData.messages.length > 0) {
          const finalMessages = chatData.messages.map(async (message) => {
            const authorData = await getUserData(message.authorId);
            return {
              ...message,
              photoURL: authorData?.photoURL,
              displayName: authorData?.displayName,
            };
          });
          const msgs = await Promise.all(finalMessages);
          setMessages(msgs);
          chatBottom!.current!.scrollIntoView({ behavior: "smooth" });
        } else {
          setCurrentChatId("");
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    });

    return unsub;
  }, [userSelected]);

  return (
    <div className="order-1 col-span-2 md:order-2">
      <header>
        <h2 className="text-2xl font-semibold">{userSelected?.username}</h2>
      </header>
      <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex max-h-96 flex-col space-y-4 overflow-y-auto p-3">
        {messages.length > 0 &&
          messages.map((message, i) => (
            <Message message={message} nextMessage={messages[i + 1]} key={i} />
          ))}
        <div ref={chatBottom}></div>
      </div>
      <div className="form-control w-full">
        <form className="input-group" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Search…"
            className="input input-bordered flex-1"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
          <button className="btn btn-primary gap-2" type="submit">
            Send
            <BiSend className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
