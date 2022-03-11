import { Menu, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/outline";
import { LogoutIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

const ProfileDropdown = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Menu as="div" className="relative grid place-content-center">
      {({ open }) => (
        <>
          <Menu.Button className="h-8 w-8">
            <Avatar
              photoURL={currentUser?.photoURL}
              displayName={currentUser?.displayName}
            />
          </Menu.Button>

          <Transition
            show={open}
            enter="transform transition duration-100 ease-in"
            enterFrom="opacity-0 scale-95"
            enterTo="opactiy-100 scale-100"
            leave="transform transition duration-75 ease-out"
            leaveFrom="opactiy-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items
              static
              as="div"
              className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <Menu.Item>
                {({ active }) => (
                  <Link href="/profile">
                    <a
                      className={`${
                        active && "bg-gray-100"
                      } flex gap-2 rounded-md p-2 font-semibold text-black hover:bg-gray-100`}
                    >
                      <UserCircleIcon className="h-6 w-6" /> Profile
                    </a>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active && "bg-gray-100"
                    } flex w-full gap-2 rounded-md p-2 font-semibold text-black hover:bg-gray-100`}
                    onClick={logout}
                  >
                    <LogoutIcon className="h-6 w-6" /> Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default ProfileDropdown;
