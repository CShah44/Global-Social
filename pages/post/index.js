import { useRef, useState } from "react";
import { db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  TextField,
  Popper,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/router";
import Navbar from "../../components/NavBar";
import toast from "react-hot-toast";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import getUser from "../../components/Actions/getUser";

function AddPostComponent() {
  const user = getUser();
  const router = useRouter();

  const filePickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);

  const [message, setMessage] = useState({ text: "", progress: 0 });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

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

  function addEmoji(emo) {
    setMessage((prev) => {
      let a = prev.text + emo.native;
      return {
        text: a,
        progress: prev.progress,
      };
    });
  }

  async function sendPostHandler() {
    if (message.text?.length <= 0) {
      toast.error("I don't like posting empty stuff! 😑");
      return;
    }

    const docRef = addDoc(collection(db, "posts"), {
      message: message.text,
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
      uid: user.uid,
      timestamp: serverTimestamp(),
      likes: [],
      repost: null,
    })
      .then((newDoc) => {
        if (!imageToPost) return;

        const imageRef = ref(storage, `posts/${newDoc.id}`);

        uploadString(imageRef, imageToPost, "data_url")
          .then((snap) => {
            const downloadURL = getDownloadURL(imageRef);

            downloadURL.then((url) => {
              updateDoc(doc(db, `posts/${newDoc.id}`), {
                postImage: url,
              }).then(() => {
                removeImage();
              });
            });
          })
          .catch(() => {
            toast.error("Sorry! Could not upload image! 😐");
          });
      })
      .then(() => {
        router.push("/");
      });

    toast.promise(docRef, {
      loading: "Posting your awesome content...",
      success: "Posted! Cheers! 😎",
      error: "Couldn't Post! 😐",
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
            value={message.text}
            error={message.progress >= 100}
            inputProps={{ maxLength: 240 }}
            color={
              message.progress >= 100
                ? "error"
                : message.progress >= 85
                ? "warning"
                : "primary"
            }
            sx={{ resize: "none" }}
            helperText={message.progress >= 100 && "Type less, say more! 😅"}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  sx={{ width: 30, height: 30, cursor: "pointer" }}
                  onClick={handleClick}
                  position="end"
                >
                  <MdOutlineEmojiEmotions />
                </InputAdornment>
              ),
            }}
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
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom">
        <Picker
          style={{ margin: 4 }}
          enableFrequentEmojiSort
          perLine={7}
          theme="dark"
          onClick={addEmoji}
        />
      </Popper>
    </>
  );
}

export default AddPostComponent;
