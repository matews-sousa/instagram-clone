import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

const usernameAlreadyInUse = async (username?: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  return querySnapshot.empty;
};

export default usernameAlreadyInUse;
