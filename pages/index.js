import Head from "next/head";
import Header from "../components/Header";
import Feed from "../components/Feed";
import { ToastProvider } from "react-toast-notifications";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito&display=swap"
          rel="stylesheet"
        />
        <title>Global Social</title>
      </Head>
      <Header />
      <ToastProvider placement="bottom-center" autoDismiss>
        <Feed />
      </ToastProvider>
    </>
  );
}
