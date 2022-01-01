import { useRef, useState } from "react";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import getUser from "../../components/Actions/getUser";
import { useRouter } from "next/router";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Navbar from "../../components/NavBar";

function AddPostComponent() {
  const user = getUser();
  const router = useRouter();

  const filePickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);

  const [message, setMessage] = useState({ text: "", progress: 0 });

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
    if (message.text?.length <= 0) {
      console.log("WRITE MORE");
      return;
    }

    await db
      .collection("posts")
      .add({
        message: message.text,
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
        console.log("post added");
      })
      .catch(() => {
        console.log("post error");
      });

    setMessage({ text: "", progress: 0 });
  }

  function changeProgress(e) {
    let x = e.target.value.replace(/\s+/g, "");
    let v = (x.length / 240) * 100;
    setMessage({ text: e.target.value, progress: v });
  }

  return (
    <>
      <Navbar />
      <Box sx={{ width: { md: "65vw", sm: "100vw" }, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            my: "5em",
            gap: 1.5,
            p: 1,
          }}
        >
          <Typography variant="h3">
            What's on your mind, {user.displayName}?
          </Typography>
          <Typography variant="h5">Create New Post</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            multiline
            fullWidth
            label="Enter your caption"
            variant="filled"
            onChange={changeProgress}
            error={message >= 100}
            sx={{ resize: "none" }}
            helperText={message >= 100 && "Type less, say more! 😅"}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              p: 2,
              m: 2,
              justifyContent: "space-around",
            }}
          >
            <Button
              disabled={message >= 100 || message <= 0}
              size="large"
              variant="contained"
              onClick={sendPostHandler}
            >
              Create
            </Button>
            <Button
              onClick={() => filePickerRef.current.click()}
              variant="contained"
              size="large"
            >
              Add A Picture
              <input
                ref={filePickerRef}
                hidden
                type="file"
                onChange={addImageToPostHandler}
              />
            </Button>
            {imageToPost && (
              <Box>
                <img
                  src={imageToPost}
                  width="80"
                  height="50"
                  style={{ objectFit: "contain" }}
                />
                <Button
                  sx={{ m: 2, p: 1 }}
                  variant="text"
                  onClick={removeImage}
                >
                  Remove
                </Button>
              </Box>
            )}
            <CircularProgress
              sx={{ margin: "0.5em", alignSelf: "flex-end" }}
              color={message >= 100 ? "error" : "primary"}
              variant="determinate"
              value={message.progress}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default AddPostComponent;
