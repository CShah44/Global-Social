import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Card, Button, InputGroup, FormControl } from "react-bootstrap";
import { db, FieldValue } from "../../firebase";
import ParticipantsModal from "./ParticipantsModal";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { useToasts } from "react-toast-notifications";

function ChatRoom({ room, name, id }) {
  const roomRef = db.collection("rooms").doc(room);

  const messagesRef = roomRef.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const [messages, loading] = useCollectionData(query);

  const [users, setUsers] = useState([]);

  const router = useRouter();

  const [showParticipants, setShowParticipants] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef();

  const { addToast } = useToasts();

  useEffect(() => {
    roomRef.get().then((data) => {
      setUsers(data.data().users);
    });
  }, []);

  async function submitHandler(e) {
    e.preventDefault();

    if (inputRef.current.value.length <= 0) {
      return addToast("The message is empty..", { appearance: "error" });
    }

    await messagesRef.add({
      text: inputRef.current.value,
      createdAt: FieldValue.serverTimestamp(),
      id,
      name,
    });

    inputRef.current.value = "";

    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function leaveRoom() {
    roomRef
      .update({
        users: FieldValue.arrayRemove({ name: name, id: id }),
      })
      .then(() => {
        setShowParticipants(false);
        addToast("You left the chat.", { appearance: "info" });
        router.replace("/chat");
      });
  }

  return (
    <>
      <ParticipantsModal
        users={users}
        show={showParticipants}
        hideModal={() => setShowParticipants(false)}
        leaveRoom={leaveRoom}
      />
      <Card
        style={{ width: "80vw", height: "90vh" }}
        bg="dark"
        text="light"
        className="neuEff  normal d-flex mx-auto my-4 text-center"
      >
        <Card.Title className="pt-2 pb-0 d-flex justify-content-between align-items-center">
          <Button
            onClick={() => router.push("/chat")}
            variant="outline-light mx-2 "
          >
            Go Back
          </Button>
          <span>{room}</span>
          <Button
            variant="outline-light mx-2 "
            onClick={() => setShowParticipants(true)}
          >
            See Participants
          </Button>
        </Card.Title>
        <Card.Body className="overflow-auto">
          {loading && <div className="text-white">Loading</div>}
          {messages &&
            messages.map((msg, index) => (
              <Message key={index} message={msg} userId={id} />
            ))}
          <span ref={scrollRef}></span>
        </Card.Body>
        <Card.Footer>
          <InputGroup className="flex-fill p-2">
            <FormControl
              as="textarea"
              maxLength={200}
              style={{ resize: "none", width: "65px" }}
              ref={inputRef}
            ></FormControl>
            <Button variant="info" type="submit" onClick={submitHandler}>
              Send
            </Button>
          </InputGroup>
        </Card.Footer>
      </Card>
    </>
  );
}

export default ChatRoom;
