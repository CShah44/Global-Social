import Head from "next/head";
import Header from "../components/Header";
import { getSession } from "next-auth/client";
import { db } from "../firebase";
import ProfilePage from "../components/Profile_Page/ProfilePage";
import Login from "../components/Login";

export default function Profile({ session, posts }) {
  if (!session) return <Login />;

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

  const posts = await db
    .collection("posts")
    .where("email", "==", session.user.email)
    .get();

  const docs = posts.docs.map((post) => ({
    id: post.id,
    ...post.data(),
    timestamp: null,
  }));

  return {
    props: {
      session,
      posts: docs,
    },
  };
}
