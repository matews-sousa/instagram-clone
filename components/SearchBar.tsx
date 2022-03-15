import { Menu, Transition } from "@headlessui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileUser } from "../types/User";
import { db } from "../utils/firebase";
import Avatar from "./Avatar";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Partial<ProfileUser>[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      if (searchQuery) {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("displayName", ">=", searchQuery),
          where("displayName", "<=", searchQuery + "\uf8ff"),
        );
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            username: docData.username,
            displayName: docData.displayName,
            photoURL: docData.photoURL,
          };
        });
        setResults(users);
        console.log(users);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <Menu as="div" className="relative">
      <input
        type="text"
        className="input input-bordered input-sm"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Transition
        show={results.length > 0 || loading === true}
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
          className="absolute mt-1 w-full overflow-auto rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {!loading ? (
            results.map((result) => (
              <Link href={`/${result.username}`}>
                <a
                  className={`"bg-blue-500 flex items-center space-x-2 rounded-md p-1 hover:bg-gray-200`}
                >
                  <Avatar
                    photoURL={result.photoURL}
                    displayName={result.displayName}
                    size={12}
                  />
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">{result.username}</p>
                    <span>{result.displayName}</span>
                  </div>
                </a>
              </Link>
            ))
          ) : (
            <div className="flex justify-center">
              <div className="btn loading btn-ghost"></div>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default SearchBar;
