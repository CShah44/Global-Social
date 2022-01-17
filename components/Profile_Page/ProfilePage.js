import { db } from "../../firebase";
import { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  Box,
  TextField,
  Stack,
  Popper,
  InputAdornment,
  CardActions,
} from "@mui/material";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { Picker } from "emoji-mart";
import getUser from "../Actions/getUser";

export default function ProfilePage({ user, docId }) {
  const currentUser = getUser();

  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  function clearField(e) {
    e.preventDefault();
    setIsEditing(false);
    setInput("");
  }

  function addEmoji(emo) {
    setInput((prev) => {
      let a = prev.toString() + emo.native;
      return a;
    });
  }

  function updateBio(e) {
    e.preventDefault();
    if (input.length <= 10) {
      return toast.error("Enter at least 10 characters.");
    }

    setIsEditing(false);

    const p = db.collection("users").doc(docId).update({
      about: input,
    });

    toast.promise(p, {
      loading: "Updating your bio...",
      success: "Done! 😁",
      error: "Couldn't Update Your Bio! 😐",
    });
  }

  return (
    <>
      <Card
        sx={{ width: { xs: "100vw", md: "650px" }, mx: "auto", my: 4, p: 3 }}
      >
        <CardHeader
          avatar={<Avatar src={user.photoURL} alt={user.name} />}
          title={
            <Stack>
              <Typography variant="h4">Hi, {user.name}</Typography>
              <Typography variant="h5">{user.email}</Typography>
            </Stack>
          }
        />
        <CardContent>
          {isEditing ? (
            <Box>
              <TextField
                onChange={(e) => setInput(e.target.value)}
                sx={{ resize: "none" }}
                fullWidth
                value={input}
                placeholder="Lets see what changes do you make in your about section..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      sx={{ m: 1, p: 1, cursor: "pointer" }}
                      onClick={handleClick}
                      position="end"
                    >
                      <MdOutlineEmojiEmotions />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                sx={{ mr: 1, mt: 1 }}
                color="success"
                onClick={updateBio}
                variant="contained"
              >
                Done
              </Button>
              <Button
                onClick={clearField}
                variant="outlined"
                color="warning"
                sx={{ ml: 1, mt: 1 }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="body1">{user.about}</Typography>
            </>
          )}
        </CardContent>
        {docId === currentUser.uid && (
          <CardActions>
            {!isEditing && (
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit Your Bio
              </Button>
            )}
          </CardActions>
        )}
      </Card>
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
