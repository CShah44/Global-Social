import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Card, Button, InputGroup, FormControl } from "react-bootstrap";
import { db, FieldValue } from "../../firebase";
import ParticipantsModal from "./ParticipantsModal";

function ChatRoom({ room, name, id }) {
  const roomRef = db.collection("rooms").doc(room); // needed if user leaves the room......
  const router = useRouter();

  const [showParticipants, setShowParticipants] = useState(false);

  const inputRef = useRef(null);

  function submitHandler(e) {
    e.preventDefault();
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
          PUT ALL THOSE MESSAGES HERE.. AND SHOW LIST OF USERS SOMEWHERE AS WELL
        </Card.Body>
        <Card.Footer>
          <InputGroup className="flex-fill p-2">
            <FormControl
              as="textarea"
              maxLength={200}
              style={{ resize: "none", width: "65px" }}
              ref={inputRef}
            ></FormControl>
            <Button variant="info" type="submit">
              Send
            </Button>
          </InputGroup>
        </Card.Footer>
      </Card>
    </>
  );
}

export default ChatRoom;
