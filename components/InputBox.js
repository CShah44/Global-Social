import Image from "next/image";
import { useSession } from "next-auth/client";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase";

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
    <div className="bg-white p-2 shadow-sm rounded mt-6 overflow-auto container-fluid">
      <div className="d-flex p-4 align-items-center">
        <Image
          src={session.user.image}
          className="rounded-full me-2"
          width={40}
          height={40}
          layout="fixed"
        />
        <form className="d-flex flex-grow-1">
          <input
            className="rounded bg-light flex-grow-1 px-5 mx-auto"
            type="text"
            ref={inputRef}
            maxLength="100"
            placeholder={`What's on your mind, ${session.user.name}?`}
          />
          <button hidden type="submit" onClick={sendPostHandler}></button>
        </form>

        {imageToPost && (
          <div
            onClick={removeImage}
            className="d-flex flex-column "
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
      </div>

      <div className="d-flex justify-content-evenly pt-1 mt-1 border-top">
        <div onClick={() => filePickerRef.current.click()}>
          <p className="fs-6">Add a Photo or Video</p>
          <input
            ref={filePickerRef}
            hidden
            type="file"
            onChange={addImageToPostHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default InputBox;
