import {
  DotsHorizontalIcon,
  ShareIcon,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/solid";
import { ChatIcon, HeartIcon } from "@heroicons/react/outline";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import IPost, { PostDoc } from "../types/Post";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";

interface PostProps {
  postDoc: PostDoc;
}

const Post = ({ postDoc }: PostProps) => {
  const [post, setPost] = useState<IPost>();
  const { currentUser } = useAuth();

  const toggleLike = async () => {
    if (currentUser && post) {
      const postRef = doc(db, "posts", postDoc.id);
      setPost(() => {
        let newLikes = [];
        if (post?.likes.includes(currentUser.uid))
          newLikes = post.likes?.filter((like) => like !== currentUser.uid);
        else newLikes = [...post.likes, currentUser.uid];

        const postUpdated = {
          ...post,
          likes: newLikes,
        };
        setDoc(postRef, postUpdated);
        return postUpdated;
      });
    }
  };

  const fetchPostData = async () => {
    const authorRef = doc(db, "users", postDoc.authorId);
    const authorDocSnap = await getDoc(authorRef);
    const authorData = authorDocSnap.data();

    const finalPost = {
      ...postDoc,
      username: authorData?.username,
      name: authorData?.name,
      photoURL: authorData?.photoURL,
      email: authorData?.email,
    };
    setPost(finalPost);
  };

  useEffect(() => {
    fetchPostData();
  }, [postDoc]);

  return (
    <div className="max-w-md border border-gray-300">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-4">
          <img src={post?.photoURL} className="h-10 w-10 rounded-full" />
          <p className="font-semibold">{post?.username}</p>
        </div>
        <button>
          <DotsHorizontalIcon className="w-6 text-black" />
        </button>
      </div>
      <img src={post?.imageUrl} className="w-full" />
      <div className="p-2">
        <div className="space-x-2">
          <button onClick={toggleLike} className="group">
            {currentUser && post?.likes.includes(currentUser?.uid) ? (
              <HeartIconSolid className="h-8 w-8 text-red-600" />
            ) : (
              <HeartIcon className="h-8 w-8 group-hover:text-red-600" />
            )}
          </button>
          <button>
            <ChatIcon className="h-8 w-8" />
          </button>
          <button>
            <ShareIcon className="h-8 w-8" />
          </button>
        </div>
        <div>
          <p className="font-semibold">{post?.likes.length} likes</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
