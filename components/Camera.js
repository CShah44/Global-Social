import { useRef, useState } from "react";
import { storage } from "../firebase";
import { Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Image from "react-bootstrap/Image";

function Camera({ addPost, setUrls }) {
  const [images, setImages] = useState([]);

  const { addToast } = useToasts();
  const filePickerRef = useRef(null);

  async function processPosting() {
    await upload().then(() => {
      addPost();
    });
  }

  async function updateImages(e) {
    e.preventDefault();
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      setImages((prevState) => [newFile, ...prevState]);
    }
  }

  async function upload() {
    if (images.length <= 0) {
      return;
    }

    const promises = [];
    images.forEach((file) => {
      const uploadTask = storage.ref().child(`images/${file.name}`).put(file);
      promises.push(uploadTask);
      uploadTask.on(
        "state_change",
        null,
        () => {
          addToast("Error!", { appearance: "error" });
        },
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          setUrls((prevState) => [downloadURL, ...prevState]);
        }
      );
    });
    Promise.all(promises)
      .then(() => addToast("Images Uploaded!", { appearance: "success" }))
      .catch(() =>
        addToast("Couldn't upload images!", { appearance: "error" })
      );

    setImages([]);
  }

  return (
    <div className="d-flex flex-column gap-3" style={{ marginLeft: "3.5em" }}>
      <div className="d-flex gap-2 my-1">
        <input
          onChange={updateImages}
          type="file"
          multiple
          hidden
          max={5}
          onError={() =>
            addToast("Select only 5 images!", { appearance: "warning" })
          }
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
          onClick={processPosting}
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
