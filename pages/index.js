import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import { ToastProvider } from "react-toast-notifications";

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Global Social</title>
      </Head>
      <Header />
      <ToastProvider placement="bottom-center" autoDismiss>
        <Feed />
      </ToastProvider>
    </>
  );
}
