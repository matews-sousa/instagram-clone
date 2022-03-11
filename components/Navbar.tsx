import Link from "next/link";
import {
  ChatIcon,
  HeartIcon,
  HomeIcon,
  PlusCircleIcon,
} from "@heroicons/react/solid";
import {
  ChatIcon as ChatOutline,
  HeartIcon as HeartOutline,
  HomeIcon as HomeOutline,
  PlusCircleIcon as PlusCircleOutline,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import ProfileDropdown from "./ProfileDropdown";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed inset-x-0 top-0 border-b border-gray-300 bg-white py-4">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 md:max-w-3xl lg:max-w-4xl">
        <Link href="/">
          <a>
            <img src="/img/Logo.svg" alt="Instagram Logo" className="w-32" />
          </a>
        </Link>
        <div className="hidden md:block">
          <input
            type="text"
            className="rounded-md border border-gray-500 bg-gray-100 py-1 px-2"
            placeholder="Search"
          />
        </div>
        <nav>
          <ul className="flex items-center space-x-4">
            {navLinks.map((link) => (
              <li key={link.url}>
                <Link href={link.url}>
                  <a>
                    {router.pathname === link.url ? link.iconActive : link.icon}
                  </a>
                </Link>
              </li>
            ))}
            <li className="cursor-pointer" onClick={() => setIsOpen(true)}>
              <PlusCircleOutline className="h-7 w-7" />
            </li>
            <li>
              <ProfileDropdown />
            </li>
          </ul>
        </nav>
      </div>
      <CreatePostModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Navbar;

const navLinks = [
  {
    url: "/",
    name: "Home",
    iconActive: <HomeIcon className="h-7 w-7 text-black" />,
    icon: <HomeOutline className="h-7 w-7 text-black" />,
  },
];
