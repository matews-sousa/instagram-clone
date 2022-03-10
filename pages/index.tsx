import { collection, onSnapshot, query } from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { PostDoc } from "../types/Post";
import { db } from "../utils/firebase";

const Home: NextPage = () => {
  const [posts, setPosts] = useState<PostDoc[]>([]);

  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const currentPosts: PostDoc[] = [];
      querySnapshot.forEach(async (document) => {
        const p = {
          id: document.id,
          imageUrl: document.data().imageUrl,
          authorId: document.data().authorId,
          caption: document.data().caption,
          likes: document.data().likes,
        };
        currentPosts.push(p);
      });
      setPosts(currentPosts);
    });

    return unsub;
  }, []);

  return (
    <Layout>
      <Navbar />
      <div>
        {posts.map((post) => (
          <Post postDoc={post} key={post.id} />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
