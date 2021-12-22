import { useContext, useState } from "react";
import {
  Card,
  CardActions,
  CardActionArea,
  CardHeader,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Stack,
  Typography,
} from "@mui/material";
import CommentsModal from "./UserFeedback/CommentsModal";
import TimeAgo from "timeago-react";
import { db, FieldValue, storage } from "../firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import { useToasts } from "react-toast-notifications";
import CurrentUser from "../contexts/CurrentUser";
import ConfirmModal from "./UserFeedback/ConfirmModal";

function Post({
  name,
  email,
  message,
  image,
  postImages,
  timestamp,
  id,
  comments,
  likes,
  uid,
  repost,
}) {
  const [showComments, setShowComments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [disableLikeButton, setDisableLikeButton] = useState(false);

  const router = useRouter();
  const currentUser = useContext(CurrentUser);
  const user = currentUser.user;

  const hasLiked = likes.includes(user.email);

  const { addToast } = useToasts();

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

  const data = {
    image: repost ? repost.image : image,
    uid: repost ? repost.uid : uid,
    name: repost ? repost.name : name,
    time: repost ? (
      <TimeAgo
        style={{ fontSize: "0.8em" }}
        datetime={new Date(repost.timestamp.toDate()).toLocaleString()}
      />
    ) : (
      timeStamp
    ),
    showDelete: user.uid === uid,
  };

  function toggleLiked() {
    setDisableLikeButton(true);
    const postRef = db.collection("posts").doc(id);

    postRef
      .update({
        likes: hasLiked
          ? FieldValue.arrayRemove(user.email)
          : FieldValue.arrayUnion(user.email),
      })
      .then(() => {
        enableLikeButton();
      })
      .catch(() =>
        addToast("Error! Can't like the post.", { appearance: "error" })
      );
  }

  function enableLikeButton() {
    setTimeout(() => {
      setDisableLikeButton(false);
    }, 1000);
  }

  function deletePostHandler() {
    setShowDeleteModal(false);
    db.collection("posts")
      .doc(id)
      .delete()
      .then(() => {
        if (postImages) {
          return storage.refFromURL(postImages).delete();
        }
      })
      .then(() => {
        addToast("Deleted Post!", { appearance: "info" });
      })
      .catch(() => {
        addToast("Could not delete post!", { appearance: "error" });
      });
  }

  function repostHandler() {
    db.collection("posts")
      .add({
        message: message,
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        uid: user.uid,
        postImages: postImages ? postImages : null,
        timestamp: FieldValue.serverTimestamp(),
        comments: [],
        likes: [],
        repost: {
          name: name,
          timestamp: timestamp,
          uid: uid,
        },
      })
      .then(() => {
        setShowRepostModal(false);
        addToast("Re-posted!", { appearance: "success" });
      })
      .catch(() => {
        addToast("Could not Re-Post!", { appearance: "error" });
      });
  }

  return (
    <>
      <CommentsModal
        comments={comments}
        hideModal={() => setShowComments(false)}
        show={showComments}
        id={id}
      />

      {/* for repost confirmation */}
      <ConfirmModal
        hideModal={() => setShowRepostModal(false)}
        show={showRepostModal}
        func={repostHandler}
        text="Are you sure you want to repost? 😎"
        title="Confirm Reposting"
      />

      {/* for delete post confirmation */}
      <ConfirmModal
        title="Delete Post"
        text="Are you sure you want to delete the post?"
        hideModal={() => setShowDeleteModal(false)}
        show={showDeleteModal}
        func={deletePostHandler}
      />

      <Card className="neuEff" sx={{ width: "100%" }}>
        {repost && (
          <Link href={`${router.basePath}/user/${uid}`}>
            <CardHeader
              title={
                name === user.displayName ? "You Reposted" : `${name} Reposted`
              }
              sx={{ cursor: "pointer" }}
              subtitle={timeStamp}
              titleTypographyProps={{ variant: "body" }}
            />
          </Link>
        )}
        <CardActionArea
          // onDoubleClick={toggleLiked}
          onClick={() => router.push(`post/${id}`)}
        >
          <CardContent>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Avatar sx={{ margin: "0.5px" }} src={data.image} />
              <Link href={`${router.basePath}/user/${data.uid}`}>
                <Typography variant="h6">{data.name}</Typography>
              </Link>
              {data.time}
            </Stack>
            <Typography gutterBottom marginTop="0.5em">
              {message}
            </Typography>
          </CardContent>
          {postImages && (
            <CardMedia component="img" src={postImages} height="500" />
          )}
        </CardActionArea>
        <CardActions>
          <Button onClick={() => setShowComments(true)}>
            Comments ({comments.length})
          </Button>
          <Button
            variant={`${hasLiked ? "contained" : "outlined"}`}
            onClick={toggleLiked}
            disabled={disableLikeButton}
          >
            Like ({likes.length})
          </Button>
          {user.email != email && (
            <Button onClick={() => setShowRepostModal(true)}>Repost</Button>
          )}
          {data.showDelete && (
            <Button color="error" onClick={() => setShowDeleteModal(true)}>
              Delete Post
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
}

export default Post;
