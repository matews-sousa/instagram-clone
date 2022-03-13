import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ProfileUser } from "../types/User";
import toggleFollow from "../utils/toggleFollow";
import Avatar from "./Avatar";

const UserCard = ({ user }: { user: ProfileUser }) => {
  const { currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<ProfileUser>(user);

  const followUnfollow = () => {
    if (currentUser && profileUser) {
      const updated = toggleFollow(currentUser, profileUser);
      setProfileUser(updated);
    }
  };

  return (
    <div className="my-4 flex w-full items-center justify-between">
      <div className="flex items-center space-x-2">
        <Avatar
          photoURL={profileUser?.photoURL}
          displayName={profileUser?.displayName}
          size={10}
        />
        <Link href={`/${profileUser?.username}`}>
          <a>{profileUser?.username}</a>
        </Link>
      </div>
      <button
        className="text-sm font-bold text-blue-600"
        onClick={followUnfollow}
      >
        {currentUser && profileUser.followers.includes(currentUser?.uid)
          ? "Unfollow"
          : "Follow"}
      </button>
    </div>
  );
};

export default UserCard;
