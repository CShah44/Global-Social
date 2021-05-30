import Image from "next/image";
import { useSession } from "next-auth/client";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase";
import { Card, Button, InputGroup, FormControl } from "react-bootstrap";

function InputBox() {
  const [session] = useSession();
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
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
    <div className="my-4">
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Add a post!</Card.Title>
          <Image
            src={session.user.image}
            className="rounded-full"
            width={40}
            height={40}
            layout="fixed"
          />

          <div>
            <InputGroup>
              <FormControl
                as="textarea"
                ref={inputRef}
                style={{ resize: "none" }}
                placeholder={`What's on your mind, ${session.user.name}?`}
              />
              <Button type="submit" onClick={sendPostHandler}>
                {" "}
                Post{" "}
              </Button>
            </InputGroup>
          </div>

          {imageToPost && (
            <div
              onClick={removeImage}
              className="px-2"
              style={{ cursor: "pointer" }}
            >
              <img
                src={imageToPost}
                className="h-6"
                width="80"
                height="50"
                style={{ objectFit: "contain" }}
              />
              <p className="fs-6 text-center">Remove</p>
            </div>
          )}

          <div>
            <div className="mt-3" onClick={() => filePickerRef.current.click()}>
              <p style={{ cursor: "pointer" }} className="fs-6">
                Add a Photo or Video
              </p>
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
