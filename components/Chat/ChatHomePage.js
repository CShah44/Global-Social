import { db, FieldValue } from "../../firebase";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import CurrentUser from "../../contexts/CurrentUser";
import ChatList from "./ChatList";

function ChatHomePage() {
  const router = useRouter();
  const { addToast } = useToasts();

  const currentUser = useContext(CurrentUser);
  const id = currentUser.user.uid;
  const name = currentUser.user.displayName;
  const [input, setInput] = useState({
    roomname: "",
    key: "",
  });

  function clearInput() {
    setInput({
      roomname: "",
      key: "",
    });
  }

  function addRoom(e) {
    e.preventDefault();
    clearInput();

    if (input.roomname === "" || input.key === "")
      return addToast("Enter valid roomname/key", {
        appearance: "warning",
      });
    else {
      const roomRef = db.collection("rooms").doc(input.roomname);

      roomRef.get().then((docsnap) => {
        if (docsnap.exists) {
          return addToast("This Room already exists. Try another name.", {
            appearance: "warning",
          });
        } else {
          roomRef.set({
            key: input.key,
            users: [{ name: name, id: id }],
          });

          setInput({ roomname: "", key: "" });

          return addToast("Room created", { appearance: "success" });
        }
      });
    }
  }

  function joinRoom(e) {
    e.preventDefault();
    clearInput();
    if (input.roomname === "" || input.key === "")
      return addToast("Enter valid roomname/key", {
        appearance: "warning",
      });
    else {
      const roomRef = db.collection("rooms").doc(input.roomname);

      roomRef.get().then((docsnap) => {
        if (docsnap.exists) {
          if (input.key === docsnap.data().key) {
            let alreadyExists = false;

            const tempUserList = docsnap.data().users;

            if (tempUserList.includes({ name: name, id: id }))
              return (alreadyExists = true);

            if (alreadyExists)
              return addToast("You are already in that room. 😒", {
                appearance: "error",
              });

            roomRef.update({
              users: FieldValue.arrayUnion({ name: name, id: id }),
            });

            addToast("Joined Room", { appearance: "success" });

            setInput({ roomname: "", key: "" });

            return router.push(`chat/${input.roomname}`);
          } else {
            return addToast("Wrong Key", { appearance: "error" });
          }
        } else {
          return addToast("No such room exists. Check your input.", {
            appearance: "error",
          });
        }
      });
    }
  }

  return (
    <>
      {/* instead put an image here...... */}
      {/* <div
        className="d-flex heading justify-content-center mt-2 align-items-center mx-auto text-white"
        style={{ fontSize: "3rem" }}
      >
        Global Social - Sociology{" "}
      </div> */}
      <Card
        style={{ width: "65vw" }}
        bg="dark"
        text="light"
        className="col rounded neuEff my-4 normal d-flex mx-auto text-center"
      >
        <Card.Title className="pt-3 pb-0 fs-1 heading">
          Create / Join a chat room!
        </Card.Title>
        <hr />
        <Card.Body>
          <Form className="fs-4">
            <Form.Group className="mb-3">
              <Form.Label className="text-white">
                Enter the name of the room{" "}
              </Form.Label>
              <Form.Control
                onChange={(e) =>
                  setInput((prevState) => ({
                    roomname: e.target.value,
                    key: prevState.key,
                  }))
                }
                placeholder="Enter Room Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Key</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setInput((prevState) => ({
                    roomname: prevState.roomname,
                    key: e.target.value,
                  }))
                }
                placeholder="Key"
                minLength="6"
              />
            </Form.Group>
            <Button
              className="m-1 py-2 px-3"
              variant="primary"
              onClick={addRoom}
              type="submit"
            >
              Create Room
            </Button>
            <Button
              className="m-1 py-2 px-3"
              variant="primary"
              onClick={joinRoom}
              type="submit"
            >
              Join Room
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <ChatList name={name} id={id} />
    </>
  );
}

export default ChatHomePage;
