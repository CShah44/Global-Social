import { useSession } from "next-auth/client";
import { db } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import * as EmailValidator from "email-validator";
import { Button } from "react-bootstrap";
import Contact from "./Contact";

function Sidebar() {
  const [session, loading] = useSession();

  if (loading) {
    return <div>Loading</div>;
  }

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", session.user.email);

  const [chatsSnapshot] = useCollection(userChatRef);

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  const createChat = () => {
    const input = prompt("Enter email of your contact");

    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== session.user.email
    ) {
      db.collection("chats").add({
        users: [session.user.email, input],
      });
    }
  };

  return (
    <div
      className="d-flex border-right overflow-scroll"
      style={{scrollbarWidth: "none" }}
    >
      <Button onClick={createChat}>Start a new chat</Button>
      {chatsSnapshot?.docs.map((chat) => (
        <Contact key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </div>
  );
}

export default Sidebar;
