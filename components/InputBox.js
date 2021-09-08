import { useContext, useRef, useState } from "react";
import { db, storage } from "../firebase";
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
import CurrentUser from "../contexts/CurrentUser";
import EmojiPickerModal from "./UserFeedback/EmojiPickerModal";

function InputBox() {
  const currentUser = useContext(CurrentUser);
  const user = currentUser.user;

  const filePickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [progress, setProgress] = useState(0);

  const inputRef = useRef(null);
  const { addToast } = useToasts();

  const addImageToPostHandler = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  };

  const removeImage = () => {
    setImageToPost(null);
  };

  async function sendPostHandler() {
    if (inputRef.current.value.length <= 0) {
      addToast("I don't like posting empty stuff. Go, write something.", {
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
      })
      .then((doc) => {
        inputRef.current.value = "";
        setProgress("");
        if (imageToPost) {
          const uploadTask = storage
            .ref(`posts/${doc.id}`)
            .putString(imageToPost, "data_url");

          removeImage();

          uploadTask.on(
            "state_change",
            null,
            (error) => console.log(error),
            () => {
              storage
                .ref(`posts`)
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  db.collection("posts").doc(doc.id).set(
                    {
                      postImages: url,
                    },
                    { merge: true }
                  );
                });
            }
          );
        }
      })
      .then(() => {
        addToast("Added Post!", { appearance: "success" });
      })
      .catch(() => {
        addToast("Could not post!", { appearance: "error" });
      });
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
    <>
      <EmojiPickerModal
        show={showEmojiPicker}
        hideModal={() => setShowEmojiPicker(false)}
        inputRef={inputRef}
      />
      <div className="my-4 mx-auto normal" style={{ width: "65vw" }}>
        <Card className="text-center neuEff" bg="dark" text="light">
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
                <Button variant="info" onClick={() => setShowEmojiPicker(true)}>
                  😎
                </Button>
              </InputGroup>
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

            <Button
              className="mt-1 ms-auto"
              variant="outline-primary"
              onClick={sendPostHandler}
            >
              Post
            </Button>
          </Card.Body>
          <Card.Footer className="d-flex align-items-center justify-content-center">
            <div className="my-1" onClick={() => filePickerRef.current.click()}>
              <Button variant="outline-light">Add a Photo</Button>
              <input
                ref={filePickerRef}
                hidden
                type="file"
                onChange={addImageToPostHandler}
              />
            </div>

            {imageToPost && (
              <div
                onClick={removeImage}
                className="px-4 d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={imageToPost}
                  width="80"
                  height="50"
                  style={{ objectFit: "contain" }}
                />
                <p className="fs-6 text-center px-2 my-auto">Remove</p>
              </div>
            )}
          </Card.Footer>
        </Card>
      </div>
    </>
  );
}

export default InputBox;
