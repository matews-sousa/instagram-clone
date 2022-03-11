import {
  DotsHorizontalIcon,
  ShareIcon,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/solid";
import { ChatIcon, HeartIcon } from "@heroicons/react/outline";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Author, PostDoc } from "../types/Post";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Avatar from "./Avatar";

dayjs.extend(relativeTime);

interface PostProps {
  postDoc: PostDoc;
}

const Post = ({ postDoc }: PostProps) => {
  const [post, setPost] = useState<PostDoc>(postDoc);
  const [author, setAuthor] = useState<Author>();
  const [showMore, setShowMore] = useState(false);
  const { currentUser } = useAuth();
  const date = post?.createdAt.toDate();

  const toggleLike = async () => {
    if (currentUser && post) {
      const postRef = doc(db, "posts", postDoc.id);
      setPost(() => {
        let newLikes: string[] = [];
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

  const fetchAuthorData = async () => {
    const authorRef = doc(db, "users", postDoc.authorId);
    const authorDocSnap = await getDoc(authorRef);
    const authorData = authorDocSnap.data();

    const finalAuthor = {
      username: authorData?.username,
      displayName: authorData?.displayName,
      photoURL: authorData?.photoURL,
    };
    setAuthor(finalAuthor);
  };

  useEffect(() => {
    fetchAuthorData();
  }, [postDoc]);

  if (!post) {
    return <div>Nothing here</div>;
  }

  return (
    <div className="max-w-md border border-gray-300">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-4">
          <Avatar
            photoURL={author?.photoURL}
            displayName={author?.displayName}
            size={10}
          />
          <p className="font-semibold">{author?.username}</p>
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
          <div className="flex">
            <p className="w-[90%] whitespace-pre-wrap">
              <span className="mr-2 font-semibold">{author?.username}</span>
              {post?.caption.slice(
                0,
                !showMore ? 50 : post?.caption.length + 1,
              )}
              {post?.caption.length >= 50 && !showMore && "..."}
            </p>
            {post?.caption.length >= 50 && !showMore && (
              <button
                className="text-sm text-gray-500"
                onClick={() => setShowMore(true)}
              >
                more
              </button>
            )}
          </div>
          <p className="mt-2 text-sm uppercase text-gray-500">
            {dayjs(date).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
