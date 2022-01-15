import { useRouter } from "next/router";
import { db, FieldValue } from "../../firebase";
import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import TimeAgo from "timeago-react";
import { useState } from "react";
import { AiOutlineRetweet, AiOutlineArrowLeft } from "react-icons/ai";
import { FcDislike, FcLike } from "react-icons/fc";
import { IconContext } from "react-icons";
import {
  toggleLiked,
  repostHandler,
} from "../../components/Actions/PostActions";
import { useRef } from "react";
import Head from "next/head";
import { useAuth } from "../../components/Actions/useAuth";

function ViewPost() {
  const router = useRouter();
  const postId = router.query.id;
  const { user } = useAuth();

  const [disableLikeButton, setDisableLikeButton] = useState(false);

  const [ref, loading, error] = useDocumentData(
    db.collection("posts").doc(postId)
  );

  if (loading) {
    return <CircularProgress />;
  }

  // TODO: CHECK IS REF IS EMPTY
  if (error || !ref) {
    return router.push("/");
  }

  // Details of the current post.
  const {
    name,
    message,
    image,
    timestamp,
    comments,
    likes,
    uid,
    repost,
    postImages,
  } = ref;

  console.log(ref);

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

  return (
    <>
      <Head>
        <title>Post ∙ {name}</title>
      </Head>
      <Box
        sx={{
          borderBottom: "1px solid whitesmoke",
          width: { xs: "100vw", sm: "500px", md: "650px" },
          mx: "auto",
          mt: 1,
        }}
      >
        <Button sx={{ mr: "auto", m: 1 }} onClick={() => router.back()}>
          <IconContext.Provider value={{ size: "2em" }}>
            <AiOutlineArrowLeft />
          </IconContext.Provider>
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 10,
          width: { xs: "100vw", sm: "500px", md: "650px" },
          mx: "auto",
          px: { xs: 2, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            mb: 2,
          }}
        >
          {repost && <Typography variant="h6"></Typography>}

          <Avatar src={repost ? repost.image : image} />
          {repost ? (
            <Link href={`${router.basePath}/user/${repost.uid}`} passHref>
              <Typography sx={{ cursor: "pointer" }} variant="h4">
                {repost.name}
              </Typography>
            </Link>
          ) : (
            <Link href={`${router.basePath}/user/${uid}`} passHref>
              <Typography sx={{ cursor: "pointer" }} variant="h4">
                {name}
              </Typography>
            </Link>
          )}
          <Typography variant="h5">
            {repost ? (
              // TODO CHECK FONT SIZE
              <TimeAgo
                style={{ fontSize: "0.8em" }}
                datetime={new Date(repost.timestamp.toDate()).toLocaleString()}
              />
            ) : (
              timeStamp
            )}
          </Typography>
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
          <Typography gutterBottom variant="h6">
            {message}
          </Typography>
          {postImages && <img src={postImages} width="100%" />}
        </Box>

        {/* Post related actions - like, delete */}
        <IconContext.Provider value={{ size: "2em" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              my: 2,
            }}
          >
            <Button
              disabled={disableLikeButton}
              onClick={() => {
                toggleLiked(user, postId, likes);
              }}
            >
              <Typography variant="body" sx={{ px: 1 }}>
                {likes.length}
              </Typography>
              {hasLiked ? <FcDislike /> : <FcLike />}
            </Button>
            {user.uid != uid && (
              <Button
                onClick={() =>
                  repostHandler(
                    user,
                    name,
                    message,
                    uid,
                    timestamp,
                    postImages,
                    image
                  )
                }
              >
                <AiOutlineRetweet />
              </Button>
            )}
          </Box>
        </IconContext.Provider>
        <CommentsArea comments={comments} id={postId} />
      </Box>
    </>
  );
}

export default ViewPost;

function CommentsArea({ comments, id }) {
  const user = getUser();
  const input = useRef(null);

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

    if (input.current.value?.length <= 0) return;

    db.collection("posts")
      .doc(id)
      .update({
        comments: FieldValue.arrayUnion({
          name: user.displayName,
          comment: input.current.value,
          email: user.email,
        }),
      })
      .catch(alert);
    input.current.value = "";
  }

  return (
    <>
      <Box>
        <TextField
          variant="outlined"
          fullWidth
          sx={{ resize: "none" }}
          label="Add a comment"
          InputProps={{ maxLength: 3 }}
          inputRef={input}
        />
        <Button sx={{ my: 1 }} variant="contained" onClick={addCommentHandler}>
          Add
        </Button>
      </Box>

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
