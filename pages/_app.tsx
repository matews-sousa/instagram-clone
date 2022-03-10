import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

const noAuthRequired = ["/login", "/sign-up"];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthProvider>
      {noAuthRequired.includes(router.pathname) ? (
        <PublicRoute>
          <Component {...pageProps} />
        </PublicRoute>
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}

export default MyApp;
