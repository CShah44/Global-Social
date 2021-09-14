import { useRouter } from "next/router";
import { useRef, useState } from "react";
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

  const [messages] = useCollectionData(query);
  console.log(messages);

  const router = useRouter();

  const [showParticipants, setShowParticipants] = useState(false);

  const inputRef = useRef(null);

  const { addToast } = useToasts();

  async function submitHandler(e) {
    e.preventDefault();

    if (inputRef.current.value.length <= 0) {
      return;
      // TODO show alert here..
    }

    await messagesRef.add({
      text: inputRef.current.value,
      createdAt: FieldValue.serverTimestamp(),
      id,
      name,
    });

    // TODO: remove this line
    console.log("msg sent");

    inputRef.current.value = "";
  }

  function leaveRoom() {
    roomRef.update({
      users: FieldValue.arrayRemove({ name: name, id: id }),
    });
    //show alert messages..
  }

  return (
    <>
      <ParticipantsModal
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
        <Card.Body>
          {messages ? (
            messages.map((msg) => (
              <Message key={msg.id} message={msg} userId={id} />
            ))
          ) : (
            <div className="text-white"> No messages yet.. </div>
          )}
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
