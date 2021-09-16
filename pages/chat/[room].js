import ChatRoom from "../../components/Chat/ChatRoom";
import { useRouter } from "next/router";
import { ToastProvider } from "react-toast-notifications";
import Head from "next/head";
import CurrentUser from "../../contexts/CurrentUser";
import { useContext } from "react";
import { db } from "../../firebase";

function Room() {
  const router = useRouter();
  const { room } = router.query;

  const currentUser = useContext(CurrentUser);
  const id = currentUser.user.uid;
  const name = currentUser.user.displayName;

  const roomRef = db.collection("rooms").doc(room);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito&display=swap"
          rel="stylesheet"
        />
        <title>Global Social · Chat -- {room} </title>
      </Head>
      <ToastProvider placement="bottom-center" autoDismiss>
        <ChatRoom room={room} name={name} id={id} />
      </ToastProvider>
    </>
  );
}

export default Room;
