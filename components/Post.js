import { useState } from "react";
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
import getUser from "./Actions/getUser";

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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
          repostHandler(user, name, message, uid, timestamp, postImages)
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
        func={() => deletePostHandler(id, postImages)}
      />

      <Card className="neuEff" sx={{ width: "100%" }}>
        <CardHeader
          title={
            <Link href={`${router.basePath}/user/${uid}`}>
              <Stack alignItems="center" direction="row" spacing={2}>
                <Avatar sx={{ margin: "0.5px" }} src={data.image} />
                <Typography variant="h6">{data.name}</Typography>
                {data.time}
              </Stack>
            </Link>
          }
          sx={{ cursor: "pointer" }}
          subtitle={timeStamp}
          titleTypographyProps={{ variant: "body" }}
          action={
            <>
              <Button onClick={handleClick}>Options</Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem>
                  <Link href={`${router.basePath}/user/${data.uid}`}>
                    View Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href={`${router.basePath}/post/${id}`}>View Post</Link>
                </MenuItem>
              </Menu>
            </>
          }
        />

        <CardActionArea onDoubleClick={() => toggleLiked(user, id, likes)}>
          <CardContent>
            {repost && name === user.displayName
              ? "You Reposted"
              : `${name} Reposted`}
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
            onClick={() => toggleLiked(user, id, likes)}
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
