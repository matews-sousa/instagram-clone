import Link from "next/link";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { CgAddR } from "react-icons/cg";
import { MdExplore, MdOutlineExplore } from "react-icons/md";
import { useRouter } from "next/router";
import ProfileDropdown from "./ProfileDropdown";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed inset-x-0 top-0 z-10 border-b border-gray-300 bg-white py-4">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 md:max-w-3xl lg:max-w-4xl">
        <Link href="/">
          <a>
            <img src="/img/Logo.svg" alt="Instagram Logo" className="w-32" />
          </a>
        </Link>
        <div className="hidden md:block">
          <SearchBar />
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
              <CgAddR className="h-7 w-7" aria-label="Create post" />
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
    iconActive: <AiFillHome className="h-7 w-7 text-black" aria-label="Home" />,
    icon: <AiOutlineHome className="h-7 w-7 text-black" aria-label="Home" />,
  },
  {
    url: "/explore",
    name: "Explose",
    iconActive: (
      <MdExplore className="h-7 w-7 text-black" aria-label="Explore" />
    ),
    icon: (
      <MdOutlineExplore className="h-7 w-7 text-black" aria-label="Explore" />
    ),
  },
];
