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
  comments: Comment[];
  createdAt: Timestamp;
}

export interface Comment {
  commentUsername?: string;
  content?: string;
  createdAt?: Timestamp;
}
