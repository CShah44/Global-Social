import ChatRoom from "../../components/Chat/ChatRoom";
import { useRouter } from "next/router";
import { ToastProvider } from "react-toast-notifications";

function Room() {
  const router = useRouter();

  const { room } = router.query;

  return (
    <ToastProvider placement="bottom-center" autoDismiss>
      <ChatRoom room={room} />
    </ToastProvider>
  );
}

export default Room;
