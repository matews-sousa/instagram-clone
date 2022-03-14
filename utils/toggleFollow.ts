import { doc, setDoc } from "firebase/firestore";
import { CurrentUser, ProfileUser } from "../types/User";
import { db } from "./firebase";

const toggleFollow = (currentUser: CurrentUser, profileUser: ProfileUser) => {
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
    displayName: currentUser.displayName,
    username: currentUser.username,
    photoURL: currentUser.photoURL,
    followers: currentUser.followers,
    following: currentUserFollowing,
  };
  // set currentUser document
  setDoc(currentUserRef, currentUserUpdated);

  const userProfileUpdated = {
    ...profileUser,
    followers: newFollows,
  };
  // extract id and posts property to don't be saved in firebase document
  const { id, posts, ...docObject } = userProfileUpdated;
  // set profileUser document
  setDoc(profileUserRef, docObject);
  return userProfileUpdated;
};

export default toggleFollow;
