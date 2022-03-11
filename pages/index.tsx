import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
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
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const currentPosts: PostDoc[] = [];
      querySnapshot.forEach(async (doc) => {
        const postData: Partial<Omit<PostDoc, "id">> = doc.data();
        currentPosts.push({
          id: doc.id,
          ...postData,
        });
      });
      setPosts(currentPosts);
    });

    return unsub;
  }, []);

  return (
    <Layout>
      <Navbar />
      <div className="space-y-6">
        {posts.map((post) => (
          <Post postDoc={post} key={post.id} />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
