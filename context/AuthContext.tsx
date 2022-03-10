import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

interface IUser extends User {
  username?: string;
}

interface IAuth {
  currentUser: IUser | null;
  signIn: (email: string, password: string) => any;
  signUp: (username: string, email: string, password: string) => any;
  logout: () => void;
}

const AuthContext = createContext<IAuth>({} as IAuth);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (username: string, email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const userRef = doc(db, "users", user.uid);
    const userData = await setDoc(userRef, {
      username: username,
    });
    console.log(userData);
    setCurrentUser({
      ...user,
      username: username,
    });

    return currentUser;
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user?.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        setCurrentUser({
          ...user,
          ...data,
        });
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
