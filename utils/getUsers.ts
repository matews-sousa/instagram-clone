import { collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";

const getUsers = async (following: string[]) => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  const currentUsers: any = [];
  querySnapshot.forEach((doc) => {
    // remove the current user
    if (following.includes(doc.id)) {
      currentUsers.push({
        id: doc.id,
        ...doc.data(),
      });
    }
  });

  return currentUsers;
};

export default getUsers;
