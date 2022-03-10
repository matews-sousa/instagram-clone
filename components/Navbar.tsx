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

const Navbar = () => {
  const router = useRouter();

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
              <li>
                <Link href={link.url}>
                  <a>
                    {router.pathname === link.url ? link.iconActive : link.icon}
                  </a>
                </Link>
              </li>
            ))}
            <li>
              <ProfileDropdown />
            </li>
          </ul>
        </nav>
      </div>
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
  {
    url: "/chat",
    name: "Home",
    iconActive: <ChatIcon className="h-7 w-7 text-black" />,
    icon: <ChatOutline className="h-7 w-7 text-black" />,
  },
  {
    url: "/add",
    name: "Home",
    iconActive: <PlusCircleIcon className="h-7 w-7 text-black" />,
    icon: <PlusCircleOutline className="h-7 w-7 text-black" />,
  },
  {
    url: "/heart",
    name: "Home",
    iconActive: <HeartIcon className="h-7 w-7 text-black" />,
    icon: <HeartOutline className="h-7 w-7 text-black" />,
  },
];
