import { useRouter } from "next/router";
import { db } from "../../firebase";
import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useDocumentData } from "react-firebase-hooks/firestore";
import getUser from "../../components/Actions/getUser";
import Image from "next/image";
import TimeAgo from "timeago-react";
import { useState } from "react";
import { AiOutlineRetweet, AiFillDelete } from "react-icons/ai";
import { FcDislike, FcLike } from "react-icons/fc";

function ViewPost() {
  const router = useRouter();
  const postId = router.query.id;
  const user = getUser();

  const [ref, loading, error] = useDocumentData(
    db.collection("posts").doc(postId)
  );

  if (error) {
    return <div>No data.</div>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  const { name, message, image, timestamp, id, comments, likes, uid, repost } =
    ref;

  const hasLiked = likes.includes(user.email);

  const timeStamp = timestamp ? (
    <TimeAgo
      style={{ fontSize: "0.8em" }}
      datetime={new Date(timestamp?.toDate()).toLocaleString()}
    />
  ) : (
    <span style={{ paddingLeft: 2, paddingRight: 2, fontSize: "0.8em" }}>
      Loading...
    </span>
  );

  // TODO: DELETE, repost modals stuff yet to be sorted maybe merge with the one on post component

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 10,
        width: { xs: "100vw", sm: "650px" },
        mx: "auto",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Avatar src={image} />
        <Typography variant="h5">{name}</Typography>
        <Typography variant="h6">{timeStamp}</Typography>
      </Box>
      <Box
        sx={{
          mt: 2,
          mb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {ref?.postImages && <Image src={postImages} layout="fill" />}
        <Typography gutterBottom>{message}</Typography>
      </Box>

      {/* Post related actions - like, delete */}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        <Button
          onClick={() => toggleLiked(user, id, likes, setDisableLikeButton)}
        >
          {hasLiked ? <FcDislike /> : <FcLike />}
        </Button>
        {user.uid != uid && (
          <Button onClick={() => setShowRepostModal(true)}>
            <AiOutlineRetweet />
          </Button>
        )}
        {user.uid === uid && (
          <Button color="error" onClick={() => setShowDeleteModal(true)}>
            <AiFillDelete />
          </Button>
        )}
      </Box>
      <CommentsArea comments={comments} id={postId} />
    </Box>
  );
}

export default ViewPost;

function CommentsArea({ comments, id }) {
  const [input, setInput] = useState("");
  const user = getUser();

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

  function addCommentHandler(e) {
    e.preventDefault();
    console.log("hi");

    if (input?.length <= 0) return;

    db.collection("posts")
      .doc(id)
      .update({
        comments: FieldValue.arrayUnion({
          name: user.displayName,
          comment: input,
          email: user.email,
        }),
      })
      .catch(alert);
    setInput("");
  }

  return (
    <>
      <TextField
        variant="outlined"
        fullWidth
        sx={{ resize: "none" }}
        label="Add a comment"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        onSubmit={addCommentHandler}
      />

      <List>
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
            <ListItemText primary="No Comments Yet!" />
          </ListItem>
        )}
      </List>
    </>
  );
}
