import { Timestamp } from "firebase/firestore";

export interface Author {
  photoURL?: string;
  username: string;
  displayName: string;
}

export interface PostDoc {
  id: string;
  authorId: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: CommentDoc[];
  createdAt: Timestamp;
}

export interface CommentDoc {
  authorId: string;
  content: string;
  createdAt: Timestamp;
}
