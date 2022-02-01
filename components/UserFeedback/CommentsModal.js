import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import getUser from "../Actions/getUser";
import { db } from "../../firebase";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useCollectionData } from "react-firebase-hooks/firestore";

function CommentsModal({ id, show, hideModal }) {
  const user = getUser();
  const [progress, setProgress] = useState(0);
  const input = useRef(null);

  const [comments] = useCollectionData(
    db.collection("posts").doc(id).collection("comments")
  );

  function addCommentHandler(e) {
    e.preventDefault();

    if (progress <= 0) return;

    db.collection("posts")
      .doc(id)
      .collection("comments")
      .add({
        name: user.displayName,
        comment: input.current.value,
        email: user.email,
        uid: user.uid,
      })
      .then(() => {
        input.current.value = "";
        setProgress(0);
      })
      .catch(() => toast.error("Could Not Comment. 😞"));
  }

  function deleteCommentHandler(comment) {
    const ref = db
      .collection("posts")
      .doc(id)
      .collection("comments")
      .where("comment", "==", comment.comment)
      .where("uid", "==", comment.uid);

    ref
      .get()
      .then((snap) => {
        snap.forEach((doc) => doc.ref.delete());
      })
      .catch(() => toast("Couldn't delete comment. 😐"));
  }

  function changeProgress(e) {
    let v = (e.target.value.length / 150) * 100;
    setProgress(v);
  }

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={show}
      onClose={hideModal}
      className="normal"
    >
      <DialogTitle>Comments</DialogTitle>
      <DialogContent>
        <List sx={{ width: "100%" }}>
          {comments?.length > 0 ? (
            comments.map(function (comment, i) {
              return (
                <ListItem
                  key={i}
                  secondaryAction={
                    user.email === comment.email ? (
                      <Button onClick={() => deleteCommentHandler(comment)}>
                        Delete
                      </Button>
                    ) : null
                  }
                >
                  <ListItemText
                    primary={comment.name}
                    secondary={comment.comment}
                  />
                </ListItem>
              );
            })
          ) : (
            <ListItem>
              <ListItemText primary="Be the first one to comment..." />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <TextField
          variant="outlined"
          fullWidth
          sx={{ resize: "none" }}
          placeholder="Add a comment"
          onChange={changeProgress}
          inputRef={input}
          error={progress > 100}
          color={
            progress >= 100 ? "error" : progress >= 85 ? "warning" : "primary"
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CircularProgress
                  value={progress}
                  color={
                    progress >= 100
                      ? "error"
                      : progress >= 85
                      ? "warning"
                      : "primary"
                  }
                  variant="determinate"
                />
              </InputAdornment>
            ),
          }}
        />
        <Button
          color="secondary"
          variant="outlined"
          sx={{ height: "100%", m: 1, py: 1.6 }}
          disabled={progress > 100}
          onClick={addCommentHandler}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CommentsModal;
