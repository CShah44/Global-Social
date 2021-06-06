import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Message from "./Message";
import { useState, useRef, Fragment } from "react";
import { db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import { Button, Navbar, InputGroup, FormControl } from "react-bootstrap";

function ChatScreen() {
  const [session] = useSession();
  const [input, setInput] = useState("");
  const endOfMessageRef = useRef(null);
  const router = useRouter();

  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => {
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />;
      });
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: session.user.email,
      photoURL: session.user.image,
    });

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Fragment>
      <Navbar>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={recipient?.photoURL}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          {recipientEmail}
          <Navbar.Text>
            {" "}
            {recipientSnapshot ? (
              <p>
                Last active:{" "}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : (
                  "Unavailable"
                )}
              </p>
            ) : (
              <p>Loading Last active...</p>
            )}
          </Navbar.Text>
        </Navbar.Brand>
      </Navbar>

      <div className="p-9" style={{ minHeight: "98vh" }}>
        {showMessages()}
        <div ref={endOfMessageRef} style={{ marginBottom: "50px" }} />
      </div>

      <InputGroup className="flex-fill p-2 fixed-bottom">
        <FormControl
          as="textarea"
          style={{ resize: "none" }}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" onClick={sendMessage}>
          {" "}
          Send{" "}
        </Button>
      </InputGroup>
    </Fragment>
  );
}

export default ChatScreen;
