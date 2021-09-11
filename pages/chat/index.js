import ChatHomePage from "../../components/Chat/ChatHomePage";
import { ToastProvider } from "react-toast-notifications";

function ChatHome() {
  return (
    <ToastProvider placement="bottom-center" autoDismiss>
      <ChatHomePage />
    </ToastProvider>
  );
}

export default ChatHome;
