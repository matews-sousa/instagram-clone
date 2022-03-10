import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.push("/login");
  }, [router, currentUser]);

  return <>{currentUser ? children : null}</>;
};

export default ProtectedRoute;
