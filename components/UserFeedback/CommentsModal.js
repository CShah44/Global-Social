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
} from "@mui/material";

import { db, FieldValue } from "../../firebase";
import { useState, useContext, useRef } from "react";
import CurrentUser from "../../contexts/CurrentUser";
import toast from "react-hot-toast";

function CommentsModal({ id, show, comments, hideModal }) {
  const currentUser = useContext(CurrentUser);
  const user = currentUser.user;
  const [progress, setProgress] = useState(0);
  const input = useRef(null);

  function addCommentHandler(e) {
    e.preventDefault();

    if (progress <= 0) return;

    db.collection("posts")
      .doc(id)
      .update({
        comments: FieldValue.arrayUnion({
          name: user.displayName,
          comment: input.current.value,
          email: user.email,
        }),
      })
      .then(() => {
        input.current.value = "";
      })
      .catch(() => toast.error("Could Not Comment. 😞"));
  }

  function deleteCommentHandler(comment) {
    db.collection("posts")
      .doc(id)
      .update({
        comments: FieldValue.arrayRemove({
          comment: comment.comment,
          name: comment.name,
          email: comment.email,
        }),
      });
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
          {comments.length > 0 ? (
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
        />
        <Button
          color="secondary"
          variant="outlined"
          sx={{ height: "100%", m: 1, p: 1 }}
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
