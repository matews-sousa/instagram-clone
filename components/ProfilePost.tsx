import { ChatAlt2Icon, HeartIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { PostDoc } from "../types/Post";

const ProfilePost = ({ post }: { post: PostDoc }) => {
  return (
    <div className="sm:square group relative h-28 cursor-pointer sm:h-auto">
      <Image src={post.imageUrl} layout="fill" objectFit="cover" />
      <div className="absolute inset-0 grid place-items-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
        <div className="flex space-x-4 opacity-0 group-hover:opacity-100">
          <div className="flex items-center space-x-2">
            <HeartIcon className="h-8 w-8 text-white" />
            <p className="font-semibold text-white">{post.likes.length}</p>
          </div>
          <div className="flex items-center space-x-2">
            <ChatAlt2Icon className="h-8 w-8 text-white" />
            <p className="font-semibold text-white">{post.comments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePost;
