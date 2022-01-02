import { db } from "../../firebase";
import { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import getUser from "../Actions/getUser";
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
} from "@mui/material";

export default function ProfilePage({ user, docId }) {
  const currentUser = getUser();

  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState("");

  function clearField(e) {
    e.preventDefault();
    setIsEditing(false);
    setInput("");
  }

  function updateAboutMe(e) {
    e.preventDefault();
    if (input.length <= 10) {
      return toast.error("At least 10 characters needed.");
    }

    setIsEditing(false);

    const p = db.collection("users").doc(docId).update({
      about: input,
    });

    toast.promise(p, {
      loading: "Updating 'About Me'...",
      success: "It's Done! 😁",
      error: "Couldn't Update 'About Me' 😐",
    });
  }

  let editButton;

  if (docId === currentUser.uid) {
    editButton = (
      <Button
        variant="contained"
        sx={{ mr: "auto", mt: 4 }}
        onClick={() => setIsEditing(true)}
      >
        Edit
      </Button>
    );
  }

  return (
    <Card sx={{ width: { xs: "100vw", md: "650px" }, mx: "auto", my: 4, p: 3 }}>
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
              placeholder="Lets see what changes do you make in your about section..."
            />
            <Button
              sx={{ mr: 1, mt: 1 }}
              color="success"
              onClick={updateAboutMe}
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
            {editButton}
          </>
        )}
      </CardContent>
    </Card>
  );
}
