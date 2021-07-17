import { useRef, useState } from "react";
import { storage, db } from "../firebase";
import { Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Image from "react-bootstrap/Image";

function Camera({ addPost, setUrls }) {
  const [images, setImages] = useState([]);
  // const [urls, setUrls] = useState([]);

  const { addToast } = useToasts();
  const filePickerRef = useRef(null);

  function updateImages(e) {
    e.preventDefault();
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      setImages((prevState) => [newFile, ...prevState]);
    }
  }

  function upload() {
    if (images.length <= 0) {
      addPost();
      return;
    }

    const promises = [];
    images.forEach((file) => {
      const uploadTask = storage.ref().child(`images/${file.name}`).put(file);
      promises.push(uploadTask);
      uploadTask.on(
        "state_change",
        null,
        (error) => console.log(error.code),
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          setUrls((prevState) => [downloadURL, ...prevState]);
        }
      );
    });
    setImages([]);
    Promise.all(promises)
      .then(() => addToast("Images Uploaded!", { appearance: "success" }))
      .catch(() =>
        addToast("Couldn't upload images!", { appearance: "error" })
      );
    addPost();
  }

  return (
    <div className="d-flex flex-column gap-3" style={{ marginLeft: "3.5em" }}>
      <div className="d-flex gap-2 my-1">
        <input
          onChange={updateImages}
          type="file"
          multiple
          hidden
          ref={filePickerRef}
        />
        <Button
          onClick={() => filePickerRef.current.click()}
          variant="outline-dark"
        >
          Add Photos
        </Button>
        <Button
          disabled={images?.length <= 0}
          variant="outline-warning"
          onClick={() => setImages([])}
        >
          Remove
        </Button>
        <Button
          className="ms-auto me-1"
          variant="outline-primary"
          onClick={upload}
        >
          Post
        </Button>
      </div>
      {images.length > 0 && (
        <div className="d-flex flex-row gap-3">
          {images.map((file, i) => (
            <Image
              src={URL.createObjectURL(file)}
              key={i}
              height={60}
              width={60}
              fluid
              alt="MMMM"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Camera;
