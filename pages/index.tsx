import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import UserCard from "../components/UserCard";
import { useAuth } from "../context/AuthContext";
import { PostDoc } from "../types/Post";
import { db } from "../utils/firebase";

const Home: NextPage = () => {
  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();

  const fetchUsers = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const currentUsers = [];
    querySnapshot.forEach((doc) => {
      // remove the current user
      if (doc.id !== currentUser?.uid) {
        currentUsers.push({
          id: doc.id,
          ...doc.data(),
        });
      }
    });
    setUsers(currentUsers);
  };

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const currentPosts: PostDoc[] = [];
      querySnapshot.forEach((doc) => {
        const postData: Partial<Omit<PostDoc, "id">> = doc.data();
        // check if currentUser follows the author of the post
        if (currentUser?.following.includes(postData.authorId)) {
          currentPosts.push({
            id: doc.id,
            ...postData,
          });
        }
      });
      setPosts(currentPosts);
    });
    fetchUsers();

    return unsub;
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {posts.map((post) => (
            <Post postDoc={post} key={post.id} />
          ))}
        </div>
        <div>
          {users.map((user) => (
            <UserCard user={user} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
