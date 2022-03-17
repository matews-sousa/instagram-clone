import { ProfileUser } from "../types/User";
import React, { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import Chat from "../components/Chat";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import getUsers from "../utils/getUsers";

const Messenger = () => {
  const [users, setUsers] = useState<Partial<ProfileUser>[]>([]);
  const [userSelected, setUserSelected] = useState<Partial<ProfileUser>>();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser) {
        const u: ProfileUser[] = await getUsers(currentUser.following);
        const followEachOther = u.filter((user) =>
          user.following.includes(currentUser.uid),
        );
        setUsers(followEachOther);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="order-2 md:order-1">
          {users.map((user) => (
            <div
              className={`my-2 flex cursor-pointer items-center space-x-2 rounded-md bg-gray-200 p-2 ${
                user.id === userSelected?.id && "bg-gray-500 text-white"
              }`}
              onClick={() => setUserSelected(user)}
              key={user.id}
            >
              <Avatar
                photoURL={user.photoURL}
                displayName={user.displayName}
                size={24}
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{user.username}</h3>
                <p>{user.displayName}</p>
              </div>
            </div>
          ))}
        </div>

        {userSelected && <Chat userSelected={userSelected} />}
      </div>
    </Layout>
  );
};

export default Messenger;
