import type { NextPage } from "next";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Home: NextPage = () => {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <Navbar />
      <div>
        {currentUser?.email}
        {currentUser?.username}
      </div>
    </Layout>
  );
};

export default Home;
