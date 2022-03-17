import { Timestamp } from "firebase/firestore";

interface Msg {
  authorId: string;
  content: string;
  createdAt: Timestamp;
}

export interface ChatDoc {
  users: string[];
  messages: Msg[];
}

export interface MessageObj extends Msg {
  photoURL: string;
  displayName: string;
}
