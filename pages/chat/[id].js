import Head from "next/head";
import getRecipientEmail from "../../utils/getRecipientEmail";
import Sidebar from "../../components/Chat/Sidebar";
import ChatScreen from "../../components/Chat/ChatScreen";
import { db } from "../../firebase";
import { useSession } from "next-auth/client";

function Chat({ chat, messages }) {
  const [session] = useSession();

  return (
    <div className="d-flex">
      <Head>
        <title> Chat with {getRecipientEmail(chat.users, session.user)} </title>
      </Head>

      <Sidebar />

      <div
        className="flex-1 overflow-scroll"
        style={{ height: "100vh", scrollbarWidth: "none" }}
      >
        <ChatScreen chat={chat} messages={messages} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  // Prep the Messages...
  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  // Prep the Chats...
  const chatRes = await ref.get();

  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    },
  };
}

export default Chat;
