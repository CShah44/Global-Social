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
  InputAdornment,
} from "@mui/material";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Link from "next/link";
import TimeAgo from "timeago-react";
import { AiOutlineRetweet, AiOutlineArrowLeft } from "react-icons/ai";
import { FcDislike, FcLike } from "react-icons/fc";
import { IconContext } from "react-icons";
import {
  toggleLiked,
  repostHandler,
} from "../../components/Actions/PostActions";
import { useRef, useState } from "react";
import Head from "next/head";
import getUser from "../../components/Actions/getUser";

function ViewPost() {
  const router = useRouter();
  const postId = router.query.id;
  const user = getUser();

  const [ref, loading, error] = useDocumentData(
    db.collection("posts").doc(postId)
  );

  if (loading) {
    return <CircularProgress />;
  }

  // TODO: CHECK IS REF IS EMPTY
  if (error) {
    return router.push("/");
  }

  const { name, message, image, timestamp, likes, uid, repost, postImages } =
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

  return (
    <>
      <Head>
        <title>Post by ∙ {name}</title>
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
        <CommentsArea id={postId} />
      </Box>
    </>
  );
}

export default ViewPost;

function CommentsArea({ id }) {
  const user = getUser();
  const input = useRef(null);
  const [progress, setProgress] = useState(0);

  const [comments] = useCollectionData(
    db.collection("posts").doc(id).collection("comments")
  );

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

  function changeProgress(e) {
    let v = (e.target.value.length / 150) * 100;
    setProgress(v);
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
          onChange={changeProgress}
          error={progress > 100}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CircularProgress
                  value={progress}
                  color={progress >= 100 ? "error" : "primary"}
                  variant="determinate"
                />
              </InputAdornment>
            ),
          }}
        />
        <Button
          disabled={progress <= 0}
          sx={{ my: 1 }}
          variant="contained"
          onClick={addCommentHandler}
        >
          Add
        </Button>
      </Box>

      <List>
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
    </>
  );
}
