import {
  DotsHorizontalIcon,
  ShareIcon,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/solid";
import { ChatIcon, HeartIcon } from "@heroicons/react/outline";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Author, PostDoc } from "../types/Post";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Avatar from "./Avatar";
import EmojiPicker from "./EmojiPicker";
import Link from "next/link";

dayjs.extend(relativeTime);

interface PostProps {
  postDoc: PostDoc;
}

const Post = ({ postDoc }: PostProps) => {
  const [post, setPost] = useState<PostDoc>(postDoc);
  const [author, setAuthor] = useState<Author>();
  const [comment, setComment] = useState("");
  const { currentUser } = useAuth();
  const date = post?.createdAt.toDate();

  const onEmojiClick = (event: any) => {
    setComment(comment + event.native);
  };

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

  const addComment = async () => {
    if (currentUser && post && comment) {
      const postRef = doc(db, "posts", postDoc.id);
      setPost(() => {
        const newComments = [
          ...post.comments,
          {
            commentUsername: currentUser.username,
            content: comment,
            createdAt: Timestamp.now(),
          },
        ];

        const postUpdated = {
          ...post,
          comments: newComments,
        };
        setDoc(postRef, postUpdated);
        setComment("");
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

  return (
    <div className="w-full border border-gray-300">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10">
            <Avatar
              photoURL={author?.photoURL}
              displayName={author?.displayName}
              size={10}
            />
          </div>
          <Link href={`/${author?.username}`}>
            <a className="font-semibold">{author?.username}</a>
          </Link>
        </div>
        <button>
          <DotsHorizontalIcon className="w-6 text-black" />
        </button>
      </div>
      <img src={post?.imageUrl} className="w-full" />
      <div className="p-2">
        <div className="space-x-2">
          <label className="swap">
            <input
              type="checkbox"
              onChange={toggleLike}
              checked={post.likes.includes(currentUser?.uid)}
            />
            <HeartIconSolid className="swap-on h-8 w-8 text-red-600" />
            <HeartIcon className="swap-off h-8 w-8 " />
          </label>
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
              {post?.caption}
            </p>
          </div>
          {post?.comments.length > 0 && (
            <button className="my-2 text-sm text-gray-600 hover:text-gray-500">
              View all {post?.comments.length} comments
            </button>
          )}
          <div>
            {post?.comments.map((comment) => (
              <div className="my-2">
                <p>
                  <Link href={`/${comment.commentUsername}`}>
                    <a className="mr-2 font-semibold">
                      {comment.commentUsername}
                    </a>
                  </Link>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs uppercase text-gray-500">
            {dayjs(date).fromNow()}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-2 border-t border-gray-300 p-1">
        <EmojiPicker onEmojiClick={onEmojiClick} />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="input input-ghost input-sm w-[90%] placeholder-gray-700"
        />
        <button
          className="text-sm font-semibold text-blue-600 hover:text-blue-500"
          onClick={addComment}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Post;
