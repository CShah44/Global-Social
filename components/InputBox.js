import { useAuthState } from "react-firebase-hooks/auth";
import { useRef, useState } from "react";
import { db, storage, auth } from "../firebase";
import firebase from "firebase";
import { Card, Button, InputGroup, FormControl, Image } from "react-bootstrap";

function InputBox() {
  const [user] = useAuthState(auth);
  const inputRef = useRef(null);
  const filePickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);

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

  const sendPostHandler = (e) => {
    e.preventDefault();

    if (!inputRef.current.value) return;

    db.collection("posts")
      .add({
        message: inputRef.current.value,
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        comments: [],
        likes: [],
      })
      .then((doc) => {
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
              //upload done!
              storage
                .ref(`posts`)
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  db.collection("posts").doc(doc.id).set(
                    {
                      postImage: url,
                    },
                    { merge: true }
                  );
                });
            }
          );
        }
      });

    inputRef.current.value = "";
  };

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
              <Button type="submit" onClick={sendPostHandler}>
                {" "}
                Post{" "}
              </Button>
            </InputGroup>

            {imageToPost && (
              <div
                onClick={removeImage}
                className="px-2"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={imageToPost}
                  width="80"
                  height="50"
                  style={{ objectFit: "contain" }}
                />
                <p className="fs-6 text-center">Remove</p>
              </div>
            )}
          </div>

          <div>
            <div className="mt-3" onClick={() => filePickerRef.current.click()}>
              <Button variant="outline-dark">Add a Photo</Button>
              <input
                ref={filePickerRef}
                hidden
                type="file"
                onChange={addImageToPostHandler}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default InputBox;
