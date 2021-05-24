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
    <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6 overflow-hidden">
      <div className="flex space-x-4 p-4 items-center">
        <Image
          src={session.user.image}
          className="rounded-full "
          width={40}
          height={40}
          layout="fixed"
        />
        <form className="flex flex-1">
          <input
            className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
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
            className="flex flex-col filter hover:brightness-110 transition hover:scale-105 duration-105 cursor-pointer"
          >
            <img src={imageToPost} className="h-10 object-contain" />
            <p className="text-xs text-red-500 text-center ">Remove</p>
          </div>
        )}
      </div>

      <div className="flex justify-evenly p-3 border-t">
        <div onClick={() => filePickerRef.current.click()}>
          <p className="text-xs sm:text-sm xl:text-base">
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
    </div>
  );
}

export default InputBox;
