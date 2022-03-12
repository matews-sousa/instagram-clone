import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProfilePost from "../components/ProfilePost";
import { PostDoc } from "../types/Post";
import getPosts from "../utils/getPosts";

const Explore = () => {
  const [posts, setPosts] = useState<PostDoc[]>([]);

  const fetchPosts = async () => {
    const p = await getPosts();
    setPosts(p);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Layout>
      <section className="mt-12 grid grid-cols-3 gap-1 sm:gap-4">
        {posts?.map((post, i) =>
          i === 1 ? (
            <div className="md:col-span-2 md:row-span-2">
              <ProfilePost post={post} key={post.id} />
            </div>
          ) : (
            <ProfilePost post={post} key={post.id} />
          ),
        )}
      </section>
    </Layout>
  );
};

export default Explore;
