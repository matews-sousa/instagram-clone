import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const getUserData = async (id: string) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return data;
};

export default getUserData;
