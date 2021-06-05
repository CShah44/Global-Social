import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Contact({ id, users }) {
  const router = useRouter();

  const [session] = useSession();
  const user = session.user;

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <div onClick={enterChat} className="d-flex align-items-center">
      {recipient ? (
        <img src={recipient.photoURL} />
      ) : (
        <img>{recipientEmail}</img>
      )}
      <p>{recipientEmail}</p>
    </div>
  );
}

export default Contact;
