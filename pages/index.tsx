import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import Layout from "../components/Layout";
import Post from "../components/Post";
import UserCard from "../components/UserCard";
import { useAuth } from "../context/AuthContext";
import { PostDoc } from "../types/Post";
import { ProfileUser } from "../types/User";
import { db } from "../utils/firebase";

const Home: NextPage = () => {
  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [users, setUsers] = useState<ProfileUser[]>([]);
  const { currentUser, logout } = useAuth();

  const fetchUsers = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const currentUsers: ProfileUser[] = [];
    querySnapshot.forEach((doc) => {
      // remove the current user
      const userData = doc.data() as ProfileUser;
      if (
        doc.id !== currentUser?.uid &&
        currentUser &&
        !userData.followers.includes(currentUser?.uid)
      ) {
        currentUsers.push({
          ...userData,
          id: doc.id,
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
        const postData = doc.data() as PostDoc;
        // check if currentUser follows the author of the post
        if (currentUser?.following.includes(postData.authorId)) {
          currentPosts.push({
            ...postData,
            id: doc.id,
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
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Avatar
                photoURL={currentUser?.photoURL}
                displayName={currentUser?.displayName}
                size={12}
              />
              <div>
                <Link href={`/${currentUser?.username}`}>
                  <a className="text-lg font-semibold">
                    {currentUser?.username}
                  </a>
                </Link>
                <p>{currentUser?.displayName}</p>
              </div>
            </div>
            <button className="font-semibold text-blue-600" onClick={logout}>
              Sign Out
            </button>
          </div>
          <div className="divider"></div>
          {users.length > 0 && (
            <h4 className="text-lg font-semibold">Suggestions for you</h4>
          )}
          {users.map((user) => (
            <UserCard user={user} key={user.id} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
