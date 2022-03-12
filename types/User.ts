import { User as FirebaseUser } from "firebase/auth";
import { PostDoc } from "./Post";

export interface ProfileUser {
  id: string;
  photoURL: string | null;
  username: string;
  displayName: string;
  posts: PostDoc[];
  followers: string[];
  following: string[];
}

export interface CurrentUser extends FirebaseUser {
  username?: string;
  photoURL: string | null;
  following: string[];
  followers: string[];
}
