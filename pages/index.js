import Head from "next/head";
import Header from "../components/Header";
import { getSession } from "next-auth/client";
import Login from "../components/Login";

export default function Home({ session }) {
  if (!session) {
    return <Login />;
  }
  return (
    <div>
      <Head>
        <title>Global Social</title>
      </Head>
      <Header />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
