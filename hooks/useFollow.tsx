import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { ProfileUser } from "../types/User";
import { db } from "../utils/firebase";

const useFollow = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const toggleFollow = (
    profileUser: ProfileUser,
    setProfileUser?: (user: ProfileUser) => void,
  ) => {
    if (currentUser && profileUser) {
      const profileUserRef = doc(db, "users", profileUser.id);
      const currentUserRef = doc(db, "users", currentUser.uid);

      let newFollows: string[] = [];
      let currentUserFollowing: string[] = [];
      if (profileUser?.followers.includes(currentUser?.uid)) {
        newFollows = profileUser.followers?.filter(
          (follow) => follow !== currentUser.uid,
        );
        currentUserFollowing = currentUser.following?.filter(
          (follow) => follow !== profileUser.id,
        );
      } else {
        newFollows = [...profileUser.followers, currentUser.uid];
        currentUserFollowing = [...currentUser.following, profileUser.id];
      }

      const currentUserUpdated = {
        ...currentUser,
        following: currentUserFollowing,
      };
      updateDoc(currentUserRef, {
        following: currentUserFollowing,
      });

      const userProfileUpdated = {
        ...profileUser,
        followers: newFollows,
      };
      // set profileUser document
      updateDoc(profileUserRef, {
        followers: newFollows,
      });
      setCurrentUser(currentUserUpdated);
      setProfileUser && setProfileUser(userProfileUpdated);
    }
  };

  return { toggleFollow };
};

export default useFollow;
