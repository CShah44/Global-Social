import { db, FieldValue } from "../../firebase";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import CurrentUser from "../../contexts/CurrentUser";

function ChatHomePage() {
  const router = useRouter();
  const { addToast } = useToasts();
  const currentUser = useContext(CurrentUser);
  const id = currentUser.user.uid;
  const name = currentUser.user.displayName;

  const [joinRoomInput, setJoinRoomInput] = useState({
    roomname: "",
    password: "",
  });

  const [addRoomInput, setAddRoomInput] = useState({
    roomname: "",
    password: "",
  });

  function addRoom(e) {
    e.preventDefault();
    const roomRef = db.collection("rooms").doc(addRoomInput.roomname);

    roomRef.get().then((docsnap) => {
      if (docsnap.exists) {
        return addToast("This Room already exists. Try another name.", {
          appearance: "warning",
        });
      } else {
        roomRef.set({
          password: addRoomInput.password,
          users: [{ name: name, id: id }],
        });

        setAddRoomInput({ roomname: "", password: "" });

        return addToast("Room created", { appearance: "success" });
      }
    });
  }

  function joinRoom(e) {
    e.preventDefault();

    const roomRef = db.collection("rooms").doc(joinRoomInput.roomname);

    roomRef.get().then((docsnap) => {
      if (docsnap.exists) {
        if (joinRoomInput.password === docsnap.data().password) {
          const alreadyExists = docsnap
            .data()
            .users.find({ name: name, id: id });
          if (alreadyExists)
            return addToast("You are already in that room. 😒", {
              appearance: "error",
            });

          roomRef.update({
            users: FieldValue.arrayUnion({ name: name, id: id }),
          });

          addToast("Room created", { appearance: "success" });

          setJoinRoomInput({ roomname: "", password: "" });

          return router.push(`chat/${joinRoomInput.roomname}`);
        } else {
          return addToast("Wrong Password", { appearance: "error" });
        }
      } else {
        return addToast("No such room exists. Check your inpupt.", {
          appearance: "error",
        });
      }
    });
  }

  return (
    <>
      <Form>
        <Form.Label> Add A Room </Form.Label>
        <Form.Group className="mb-3">
          <Form.Label>Enter the name of the room </Form.Label>
          <Form.Control
            onChange={(e) =>
              setAddRoomInput((prevState) => ({
                roomname: e.target.value,
                password: prevState.password,
              }))
            }
            placeholder="Enter Room Name"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) =>
              setAddRoomInput((prevState) => ({
                roomname: prevState.roomname,
                password: e.target.value,
              }))
            }
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button variant="primary" onClick={addRoom} type="submit">
          Add Room
        </Button>
      </Form>
      <hr />
      <Form>
        <Form.Label> Join A Room </Form.Label>
        <Form.Group className="mb-3" controlId="roomname">
          <Form.Label>Enter the name of the room </Form.Label>
          <Form.Control
            onChange={(e) =>
              setJoinRoomInput((prevState) => ({
                roomname: e.target.value,
                password: prevState.password,
              }))
            }
            type="text"
            placeholder="Enter Room Name"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="roompassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) =>
              setJoinRoomInput((prevState) => ({
                roomname: prevState.roomname,
                password: e.target.value,
              }))
            }
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        <Button onClick={joinRoom} variant="primary" type="submit">
          Join Room
        </Button>
      </Form>
    </>
  );
}

export default ChatHomePage;
