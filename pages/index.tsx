import type { NextPage } from "next";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const Home: NextPage = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Layout>
      {currentUser?.email}
      {currentUser?.username}
      <button onClick={logout}>Logout</button>
    </Layout>
  );
};

export default Home;
