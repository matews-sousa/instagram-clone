import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import ProfilePost from "../components/ProfilePost";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import { ProfileUser } from "../types/User";
import Link from "next/link";
import Image from "next/image";
import useFollow from "../hooks/useFollow";

const Profile = () => {
  const [profileUser, setProfileUser] = useState<ProfileUser>();
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toggleFollow } = useFollow();
  const router = useRouter();
  const { username } = router.query;

  const followUnfollow = () => {
    if (profileUser) toggleFollow(profileUser, setProfileUser);
  };

  const fetchProfileUser = async () => {
    setLoading(true);
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc: Partial<Omit<ProfileUser, "id">> =
        querySnapshot.docs[0].data();
      const postsRef = collection(db, "posts");
      const userPostsQuery = query(
        postsRef,
        where("authorId", "==", querySnapshot.docs[0].id),
      );
      const userPostsQuerySnapshot = await getDocs(userPostsQuery);
      const userPosts = userPostsQuerySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      const user: any = {
        id: querySnapshot.docs[0].id,
        ...userDoc,
        posts: userPosts,
      };
      setProfileUser(user);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileUser();
  }, [username]);

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  } else if (!profileUser) {
    return (
      <Layout>
        <h1 className="text-center text-4xl font-semibold">User not found</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="mb-4 flex items-center space-x-4 md:space-x-24">
          <div className="flex flex-col items-center">
            {profileUser?.photoURL ? (
              <div className="avatar">
                <div className="relative w-24 md:w-36">
                  <Image
                    src={profileUser?.photoURL}
                    layout="fill"
                    className="rounded-full"
                  />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="w-24 rounded-full bg-neutral-focus text-neutral-content md:w-36">
                  <span className="text-3xl">
                    {profileUser?.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <h2 className="text-base md:hidden">{profileUser?.username}</h2>
          </div>
          <div>
            <div className="hidden items-end space-x-6 md:flex">
              <h2 className="text-3xl">{profileUser?.username}</h2>
              {currentUser?.uid === profileUser?.id ? (
                <Link href="/edit">
                  <a className="btn btn-outline btn-sm">Edit Profile</a>
                </Link>
              ) : (
                <button
                  className="btn btn-info btn-sm text-white"
                  onClick={followUnfollow}
                >
                  {currentUser &&
                  profileUser?.followers.includes(currentUser?.uid)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </div>
            <div className="flex space-x-6 md:my-6">
              <p className="">{profileUser?.posts.length} posts</p>
              <p className="">{profileUser?.followers?.length} followers</p>
              <p className="">{profileUser?.following?.length} following</p>
            </div>
            <h3 className="hidden text-xl font-semibold md:visible">
              {profileUser?.displayName}
            </h3>
          </div>
        </div>
        {currentUser?.uid === profileUser?.id ? (
          <Link href="/edit">
            <a className="btn btn-outline btn-sm w-full md:hidden">
              Edit Profile
            </a>
          </Link>
        ) : (
          <button
            className="btn btn-info btn-sm w-full text-white md:hidden"
            onClick={followUnfollow}
          >
            {currentUser && profileUser?.followers.includes(currentUser?.uid)
              ? "Unfollow"
              : "Follow"}
          </button>
        )}
      </div>
      <section className="mt-12 grid grid-cols-3 gap-1 sm:gap-4">
        {profileUser?.posts.map((post) => (
          <ProfilePost post={post} key={post.id} />
        ))}
      </section>
    </Layout>
  );
};

export default Profile;
