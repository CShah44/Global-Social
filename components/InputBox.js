import { useContext, useRef, useState } from "react";
import { db } from "../firebase";
import firebase from "firebase";
import {
  Card,
  InputGroup,
  FormControl,
  Image,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Camera from "./Camera";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

import CurrentUser from "../contexts/CurrentUser";

function InputBox() {
  const currentUser = useContext(CurrentUser);
  const user = currentUser.user;

  const [urls, setUrls] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [progress, setProgress] = useState(0);

  const inputRef = useRef(null);
  const { addToast } = useToasts();

  async function sendPostHandler() {
    if (inputRef.current.value.length <= 0) {
      addToast("Your brain is as empty as the post content. Go, fill it in!", {
        appearance: "warning",
      });
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

  function changeProgress(e) {
    if (e.target.value.length === 240) {
      addToast("You have reached maximum character limit. Stop typing!", {
        appearance: "warning",
      });
    }

    setProgress(e.target.value);
  }

  return (
    <div className="my-4 mx-auto normal" style={{ width: "65vw" }}>
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
                onChange={changeProgress}
                style={{ resize: "none" }}
                placeholder={`What's on your mind, ${user.displayName}?`}
              ></FormControl>
              <Button
                variant="info"
                onClick={() => setShowEmojiPicker((p) => !p)}
              >
                😎
              </Button>
            </InputGroup>

            {showEmojiPicker && (
              <Picker
                set="google"
                enableFrequentEmojiSort
                style={{
                  position: "absolute",
                  marginTop: "5em",
                  right: "20px",
                  zIndex: 1,
                }}
                theme="dark"
                onClick={(emo) => {
                  inputRef.current.value += emo.native;
                  return console.log("done");
                }}
              />
            )}
          </div>

          <Card.Text as="div">
            <ProgressBar
              now={progress.length}
              max={240}
              animated
              className="m-2 mt-0 ms-auto me-2"
              style={{ height: "5px", width: "92%" }}
            />
          </Card.Text>

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
