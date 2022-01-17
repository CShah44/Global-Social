import { useEffect, useState } from "react";
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
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  deletePostHandler,
  repostHandler,
  toggleLiked,
} from "./Actions/PostActions";
import CommentsModal from "./UserFeedback/CommentsModal";
import TimeAgo from "timeago-react";
import { useRouter } from "next/router";
import Link from "next/link";
import ConfirmModal from "./UserFeedback/ConfirmModal";
import { CgComment } from "react-icons/cg";
import { FcLike, FcDislike } from "react-icons/fc";
import { AiFillDelete, AiOutlineRetweet, AiOutlineMenu } from "react-icons/ai";
import { IconContext } from "react-icons";
import { db } from "../firebase";
import getUser from "./Actions/getUser";

function Post({
  name,
  email,
  message,
  image,
  postImages,
  timestamp,
  id,
  likes,
  uid,
  repost,
}) {
  const [showComments, setShowComments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [disableLikeButton, setDisableLikeButton] = useState(false);
  const [comments, setComments] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    db.collection("posts")
      .doc(id)
      .collection("comments")
      .get()
      .then((snap) => {
        setComments(snap.docs);
        console.log(comments);
      });
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const user = getUser();

  const hasLiked = likes.includes(user.email);

  const timeStamp = timestamp ? (
    <TimeAgo
      style={{ fontSize: "0.7em" }}
      datetime={new Date(timestamp?.toDate()).toLocaleString()}
    />
  ) : (
    <span style={{ paddingLeft: 2, paddingRight: 2, fontSize: "0.7em" }}>
      Loading...
    </span>
  );

  // checking if reposted and accordingly assinging data to be displayed.
  const data = {
    image: repost ? repost.image : image,
    uid: repost ? repost.uid : uid,
    name: repost ? repost.name : name,
    time: repost ? (
      <TimeAgo
        style={{ fontSize: "0.7em" }}
        datetime={new Date(repost.timestamp.toDate()).toLocaleString()}
      />
    ) : (
      timeStamp
    ),
    showDelete: user.uid === uid,
  };

  function processDelete() {
    deletePostHandler(id, postImages);
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
        func={() =>
          repostHandler(user, name, message, uid, timestamp, postImages, image)
        }
        text="Are you sure you want to repost? 😎"
        title="Confirm Reposting"
      />

      {/* for delete post confirmation */}
      <ConfirmModal
        title="Delete Post"
        text="Are you sure you want to delete the post?"
        hideModal={() => setShowDeleteModal(false)}
        show={showDeleteModal}
        func={processDelete}
      />

      <Card className="neuEff" sx={{ width: "100%" }}>
        <IconContext.Provider value={{ size: "1.35em" }}>
          {repost && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ m: 1, p: 0.5 }}
              alignItems="center"
            >
              <Typography variant="body2">
                {name === user.displayName
                  ? "You Reposted"
                  : `${name} Reposted`}
              </Typography>
              <AiOutlineRetweet />
            </Stack>
          )}
          <CardHeader
            title={
              <Stack alignItems="center" direction="row" spacing={2}>
                <Link href={`${router.basePath}/user/${data.uid}`}>
                  <Avatar sx={{ margin: "0.5px" }} src={data.image} />
                </Link>
                <Typography variant="h6">{data.name}</Typography>
                {data.time}
              </Stack>
            }
            sx={{ cursor: "pointer" }}
            subtitle={timeStamp}
            action={
              <>
                <Button onClick={handleClick}>
                  <AiOutlineMenu />
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <Link href={`${router.basePath}/user/${data.uid}`} passHref>
                    <MenuItem>View Profile</MenuItem>
                  </Link>
                  <Link href={`${router.basePath}/post/${id}`} passHref>
                    <MenuItem>View Post</MenuItem>
                  </Link>
                </Menu>
              </>
            }
          />

          <CardActionArea onDoubleClick={() => toggleLiked(user, id, likes)}>
            <CardContent>
              <Typography variant="body1" gutterBottom marginTop="0.5em">
                {message}
              </Typography>
            </CardContent>
            {postImages && (
              <CardMedia
                component="img"
                src={postImages}
                sx={{ width: { xs: "100%", sm: "500px", md: "650px" } }}
                alt="Post Image"
              />
            )}
          </CardActionArea>
          <CardActions sx={{ p: 1, borderTop: "0.1px solid grey" }}>
            <Button onClick={() => setShowComments(true)}>
              <Typography variant="body" sx={{ px: 1 }}>
                {comments.length}
              </Typography>
              <CgComment />
            </Button>
            <Button
              onClick={() => toggleLiked(user, id, likes)}
              disabled={disableLikeButton}
            >
              <Typography variant="body" sx={{ px: 1 }}>
                {likes.length}
              </Typography>
              {hasLiked ? <FcDislike /> : <FcLike />}
            </Button>
            {user.email != email && (
              <Button onClick={() => setShowRepostModal(true)}>
                <AiOutlineRetweet />
              </Button>
            )}
            {data.showDelete && (
              <Button color="error" onClick={() => setShowDeleteModal(true)}>
                <AiFillDelete />
              </Button>
            )}
          </CardActions>
        </IconContext.Provider>
      </Card>
    </>
  );
}

export default Post;
