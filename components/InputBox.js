import { useAuthState } from "react-firebase-hooks/auth";
import { useRef, useState } from "react";
import { db, auth } from "../firebase";
import firebase from "firebase";
import { Card, Button, InputGroup, FormControl, Image } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Camera from "./Camera";

function InputBox() {
  const [user] = useAuthState(auth);
  const [urls, setUrls] = useState([]);
  const inputRef = useRef(null);
  const { addToast } = useToasts();

  async function sendPostHandler() {
    if (!inputRef.current.value) {
      addToast("Don't post empty stuff...", { appearance: "warning" });
      return;
    }

    await db
      .collection("posts")
      .add({
        message: inputRef.current.value,
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        uid: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        comments: [],
        likes: [],
        repost: null,
        postImages: urls,
      })
      .then(() => {
        addToast("Added Post!", { appearance: "success" });
      })
      .catch(() => {
        addToast("Could not post!", { appearance: "error" });
      });

    inputRef.current.value = "";
  }

  return (
    <div className="my-4 mx-auto" style={{ width: "65vw" }}>
      <Card className="text-center">
        <Card.Title className="pt-3 pb-0">Add Your Post!</Card.Title>
        <Card.Body>
          <div className="d-flex flex-row justify-content-evenly">
            <Image
              src={user.photoURL}
              className="me-auto my-2"
              roundedCircle
              width={50}
              height={50}
              layout="fixed"
            />

            <InputGroup className=" flex-fill p-2">
              <FormControl
                as="textarea"
                maxLength={240}
                ref={inputRef}
                style={{ resize: "none" }}
                placeholder={`What's on your mind, ${user.displayName}?`}
              />
            </InputGroup>
          </div>

          <Camera
            className="mt-3"
            setUrls={setUrls}
            addPost={sendPostHandler}
          />
        </Card.Body>
      </Card>
    </div>
  );
}

export default InputBox;
