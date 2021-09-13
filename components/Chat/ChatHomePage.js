import { db, FieldValue } from "../../firebase";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import CurrentUser from "../../contexts/CurrentUser";
import { useCollection } from "react-firebase-hooks/firestore";

function ChatHomePage() {
  const router = useRouter();
  const { addToast } = useToasts();

  const currentUser = useContext(CurrentUser);
  const id = currentUser.user.uid;
  const name = currentUser.user.displayName;
  const [input, setInput] = useState({
    roomname: "",
    password: "",
  });

  const [yourRooms] = useCollection(
    db
      .collection("rooms")
      .where("users", "array-contains", { name: name, id: id })
  );

  function clearInput() {
    setInput({
      roomname: "",
      password: "",
    });
  }

  function addRoom(e) {
    e.preventDefault();
    clearInput();

    if (input.roomname === "" || input.password === "")
      return addToast("Enter valid roomname/password", {
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
            password: input.password,
            users: [{ name: name, id: id }],
          });

          setInput({ roomname: "", password: "" });

          return addToast("Room created", { appearance: "success" });
        }
      });
    }
  }

  function joinRoom(e) {
    e.preventDefault();
    clearInput();
    if (input.roomname === "" || input.password === "")
      return addToast("Enter valid roomname/password", {
        appearance: "warning",
      });
    else {
      const roomRef = db.collection("rooms").doc(input.roomname);

      roomRef.get().then((docsnap) => {
        if (docsnap.exists) {
          if (input.password === docsnap.data().password) {
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

            setInput({ roomname: "", password: "" });

            return router.push(`chat/${input.roomname}`);
          } else {
            return addToast("Wrong Password", { appearance: "error" });
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
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">
            Enter the name of the room{" "}
          </Form.Label>
          <Form.Control
            onChange={(e) =>
              setInput((prevState) => ({
                roomname: e.target.value,
                password: prevState.password,
              }))
            }
            placeholder="Enter Room Name"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">Password</Form.Label>
          <Form.Control
            onChange={(e) =>
              setInput((prevState) => ({
                roomname: prevState.roomname,
                password: e.target.value,
              }))
            }
            type="password"
            placeholder="Password"
            minLength="6"
          />
        </Form.Group>
        <Button variant="primary" onClick={addRoom} type="submit">
          Create Room
        </Button>
        <Button variant="primary" onClick={joinRoom} type="submit">
          Join Room
        </Button>
      </Form>
      <h1 className="text-white">Your Rooms</h1>
      <ListGroup variant="flush">
        {yourRooms?.docs?.map((doc) => {
          return (
            <ListGroup.Item
              key={doc.ref}
              onClick={() => router.push(`chat/${doc.id}`)}
            >
              {doc.id}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
}

export default ChatHomePage;
