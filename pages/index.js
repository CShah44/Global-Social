import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import { db } from "../firebase";
import Login from "../components/Login";

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Global Social</title>
      </Head>
      <Header />
      <Feed posts={posts} />
    </div>
  );
}

export async function getServerSideProps() {
  const posts = await db.collection("posts").orderBy("timestamp", "desc").get();

  const docs = posts.docs.map((post) => ({
    id: post.id,
    ...post.data(),
    timestamp: null,
  }));

  return {
    props: {
      posts: docs,
    },
  };
}
