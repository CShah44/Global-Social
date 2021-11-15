import { useContext, useRef, useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Typography,
  TextField,
  Avatar,
} from "@mui/material";
import { useToasts } from "react-toast-notifications";
import CurrentUser from "../contexts/CurrentUser";

function InputBox() {
  const currentUser = useContext(CurrentUser);
  const user = currentUser.user;

  const filePickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);

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
    if (inputRef.current.value?.length <= 0) {
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
    let v = (e.target.value.length / 240) * 100;
    setProgress(v);
  }

  return (
    <Box marginBottom="3em" marginTop="3em" width="65vw">
      <Card sx={{ padding: "5px" }}>
        <CardHeader
          titleTypographyProps={{ variant: "h5" }}
          title="Add Your Post!"
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar src={user.photoURL} sx={{ margin: "0.5em" }} />
          <TextField
            label={`What's Up, ${user.displayName}?`}
            multiline
            fullWidth
            variant="filled"
            placeholder="Type Your Message..."
            ref={inputRef}
            onChange={changeProgress}
            error={progress >= 100}
            sx={{ resize: "none" }}
          />
          <CircularProgressWithLabel value={progress} />
        </CardContent>
        <CardActions sx={{ margin: "1em" }}>
          <Button size="large" variant="contained" onClick={sendPostHandler}>
            Post
          </Button>
          <Button variant="contained" size="large">
            Upload
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default InputBox;

function CircularProgressWithLabel({ value }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        sx={{ margin: "0.3em" }}
        color={value >= 100 ? "error" : "primary"}
        variant="determinate"
        value={value}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
