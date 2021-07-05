import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import { db } from "../firebase";
import { ToastProvider } from "react-toast-notifications";

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Global Social</title>
      </Head>
      <Header />
      <ToastProvider placement="bottom-center" autoDismiss>
        <Feed posts={posts} />
      </ToastProvider>
    </>
  );
}

export async function getServerSideProps() {
  const posts = await db.collection("posts").orderBy("timestamp", "desc").get();

  const docs = posts.docs.map((post) => ({
    id: post.id,
    ...post.data(),
    timestamp: null,
    repost: null,
  }));

  return {
    props: {
      posts: docs,
    },
  };
}
