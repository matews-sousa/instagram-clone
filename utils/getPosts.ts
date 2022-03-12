import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { PostDoc } from "../types/Post";
import { db } from "./firebase";

const getPosts = async () => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const currentPosts: PostDoc[] = [];
  querySnapshot.forEach((doc) => {
    const docData = doc.data();
    currentPosts.push({
      id: doc.id,
      authorId: docData.authorId,
      imageUrl: docData.imageUrl,
      comments: docData.comments,
      caption: docData.caption,
      likes: docData.likes,
      createdAt: docData.createdAt,
    });
  });

  return currentPosts;
};

export default getPosts;
