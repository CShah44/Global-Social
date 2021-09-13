import ChatHomePage from "../../components/Chat/ChatHomePage";
import { ToastProvider } from "react-toast-notifications";
import Head from "next/head";

function ChatHome() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito&display=swap"
          rel="stylesheet"
        />
        <title>Global Social · Chat </title>
      </Head>
      <ToastProvider placement="bottom-center" autoDismiss>
        <ChatHomePage />
      </ToastProvider>
    </>
  );
}

export default ChatHome;
