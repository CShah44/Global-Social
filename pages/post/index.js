import { useContext, useRef, useState } from "react";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  TextField,
  Avatar,
} from "@mui/material";
import CurrentUser from "../../contexts/CurrentUser";

// UI to be changes.
function AddPostComponent() {
  const currentUser = useContext(CurrentUser);
  const user = currentUser.user;

  const filePickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);

  const [progress, setProgress] = useState(0);

  const inputRef = useRef(null);

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
    if (inputRef.current.value?.length <= 0) {
      console.log("WRITE MORE");
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
        console.log("post added");
      })
      .catch(() => {
        console.log("post error");
      });
  }

  function changeProgress(e) {
    let v = (e.target.value.length / 240) * 100;
    setProgress(v);
  }

  return (
    <Box sx={{ width: { md: "65vw", sm: "100vw" }, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          my: "5em",
        }}
      >
        <Typography variant="h3">
          What's on your mind, {user.displayName} ?
        </Typography>
        <Typography variant="h5">Add A New Post</Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <TextField
          multiline
          fullWidth
          variant="filled"
          placeholder="Type Your Message..."
          ref={inputRef}
          onChange={changeProgress}
          error={progress >= 100}
          sx={{ resize: "none" }}
        />
        <CircularProgress
          sx={{ margin: "0.3em" }}
          color={progress >= 100 ? "error" : "primary"}
          variant="determinate"
          value={progress}
        />
        <Button
          disabled={progress >= 100}
          size="large"
          variant="contained"
          onClick={sendPostHandler}
        >
          Post
        </Button>
        <Button variant="contained" size="large">
          Upload
        </Button>
      </Box>
    </Box>
  );
}

export default AddPostComponent;
