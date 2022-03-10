import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) router.push("/");
  }, [router, currentUser]);

  return <>{!currentUser ? children : null}</>;
};

export default PublicRoute;
