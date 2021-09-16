import ChatHomePage from "../../components/Chat/ChatHomePage";
import { ToastProvider } from "react-toast-notifications";
import Head from "next/head";

function ChatHome() {
  return (
    <>
      <Head>
        <title>Global Social · Chat </title>
      </Head>
      <ToastProvider placement="bottom-center" autoDismiss>
        <ChatHomePage />
      </ToastProvider>
    </>
  );
}

export default ChatHome;
