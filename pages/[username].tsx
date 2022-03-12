import { collection, getDocs, query, where } from "firebase/firestore";
import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import { PostDoc } from "../types/Post";
import ProfilePost from "../components/ProfilePost";

interface ProfilePageProps {
  user: {
    id: string;
    photoURL: string | null;
    username: string;
    displayName: string;
    posts: number;
    followers: string[];
    following: string[];
  };
  error?: string;
}

const Profile: NextPage<ProfilePageProps> = ({ user, error }) => {
  const [posts, setPosts] = useState<PostDoc[]>();
  const { currentUser } = useAuth();

  const fetchUserPosts = async () => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("authorId", "==", user.id));
    const querySnapshot = await getDocs(q);

    const posts = querySnapshot.docs.map((doc) => {
      const postData = doc.data();
      return {
        id: doc.id,
        ...postData,
      };
    });
    setPosts(posts);
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  if (error) {
    return (
      <Layout>
        <div>
          <h1 className="text-center text-5xl font-semibold">{error}</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="mb-4 flex items-center space-x-4 md:space-x-24">
          <div className="flex flex-col items-center">
            {user?.photoURL ? (
              <div className="avatar">
                <div className="w-24 rounded-full md:w-36">
                  <img src={user?.photoURL} />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="w-24 rounded-full bg-neutral-focus text-neutral-content md:w-36">
                  <span>{user?.displayName.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            )}
            <h2 className="text-base md:hidden">{user.username}</h2>
          </div>
          <div>
            <div className="hidden items-end space-x-6 md:flex">
              <h2 className="text-3xl">{user.username}</h2>
              {currentUser?.uid === user.id ? (
                <button className="btn btn-outline btn-sm">Edit Profile</button>
              ) : (
                <button className="btn btn-info btn-sm text-white">
                  Follow
                </button>
              )}
            </div>
            <div className="flex space-x-6 md:my-6">
              <p className="">{user?.posts} posts</p>
              <p className="">{user?.followers?.length} followers</p>
              <p className="">{user?.following?.length} following</p>
            </div>
            <h3 className="hidden text-xl font-semibold md:visible">
              {user.displayName}
            </h3>
          </div>
        </div>
        {currentUser?.uid === user.id ? (
          <button className="btn btn-outline btn-sm w-full md:hidden">
            Edit Profile
          </button>
        ) : (
          <button className="btn btn-info btn-sm w-full text-white md:hidden">
            Follow
          </button>
        )}
      </div>
      <section className="mt-12 grid grid-cols-3 gap-1 sm:gap-4">
        {posts?.map((post) => (
          <ProfilePost post={post} />
        ))}
      </section>
    </Layout>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = context.params?.username;

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0].data();
    const postsRef = collection(db, "posts");
    const userPostsQuery = query(
      postsRef,
      where("authorId", "==", querySnapshot.docs[0].id),
    );
    const userPostsQuerySnapshot = await getDocs(userPostsQuery);

    const user = {
      id: querySnapshot.docs[0].id,
      ...userDoc,
      posts: userPostsQuerySnapshot.docs.length,
    };

    return {
      props: {
        user: user,
      },
    };
  } else {
    return {
      props: {
        error: "User not found",
      },
    };
  }
};
