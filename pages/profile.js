import Head from "next/head";
import Header from "../components/Header";
import { getSession } from "next-auth/client";
import { db } from "../firebase";
import ProfilePage from "../components/ProfilePage";

export default function Profile({ posts }) {
  return (
    <div>
      <Head>
        <title>Global Social</title>
      </Head>
      <Header />
      <ProfilePage posts={posts} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const posts = db
    .collection("posts")
    .where("email", "==", session.user.email)
    .orderBy("timestamp", "desc")
    .get();

  const docs = posts?.docs?.map((post) => ({
    id: post.id,
    ...post.data(),
    timestamp: null,
  }));

  return {
    props: {
      session,
      posts: docs ? docs : null,
    },
  };
}
