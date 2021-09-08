import { Fragment, useContext, useState } from "react";
import { Card, Button, Carousel } from "react-bootstrap";
import CommentsModal from "./UserFeedback/CommentsModal";
import TimeAgo from "timeago-react";
import { db, FieldValue, storage } from "../firebase";
import DeletePostModal from "./UserFeedback/DeletePostModal";
import { useRouter } from "next/router";
import Link from "next/link";
import { useToasts } from "react-toast-notifications";
import Image from "next/image";
import classes from "./Post.module.css";
import CurrentUser from "../contexts/CurrentUser";
import ConfirmRepost from "./UserFeedback/ConfirmRepost";

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
  showUserOptions,
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
    <span className="px-2" style={{ fontSize: "0.8em" }}>
      Loading...
    </span>
  );

  function hideCommentsModal() {
    setShowComments(false);
  }

  function hideDeletePostModal() {
    setShowDeleteModal(false);
  }

  function toggleLiked() {
    setDisableLikeButton(true);

    const postRef = db.collection("posts").doc(id);

    if (hasLiked) {
      postRef
        .update({
          likes: FieldValue.arrayRemove(user.email),
        })
        .then(() => {
          enableLikeButton();
        })
        .catch(() =>
          addToast("Error! Can't unlike the post.", { appearance: "error" })
        );
      return;
    }

    postRef
      .update({
        likes: FieldValue.arrayUnion(user.email),
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
    hideDeletePostModal();
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

  function processRepostHeader() {
    if (repost) {
      return (
        <Link href={`${router.basePath}/user/${uid}`}>
          <Card.Header style={{ cursor: "pointer" }}>
            {name === user.displayName ? "You" : `${name}`} Reposted ,{" "}
            {timeStamp}
          </Card.Header>
        </Link>
      );
    } else return null;
  }

  function repostHandler() {
    db.collection("posts")
      .add({
        message: message,
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        uid: user.uid,
        postImages: postImages ? psotImages : null,
        timestamp: FieldValue.serverTimestamp(),
        comments: [],
        likes: [],
        repost: {
          name: name,
          image: image,
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
    <Fragment>
      <CommentsModal
        comments={comments}
        hideModal={hideCommentsModal}
        show={showComments}
        id={id}
      />

      <ConfirmRepost
        hideModal={() => setShowRepostModal(false)}
        show={showRepostModal}
        repost={repostHandler}
      />

      <DeletePostModal
        id={id}
        hideModal={hideDeletePostModal}
        show={showDeleteModal}
        deletePost={deletePostHandler}
      />

      <Card className="w-90 my-5 normal neuEff" bg="dark" text="light">
        {processRepostHeader()}
        <Card.Body>
          <Card.Text as="div">
            <div className="d-flex flex-grow-1">
              {repost ? (
                <>
                  <img
                    src={repost.image}
                    width="40"
                    height="40"
                    className="rounded m-1"
                    alt=""
                  />

                  <span className="px-2">
                    <Link href={`${router.basePath}/user/${repost.uid}`}>
                      <span style={{ fontSize: "1.1em", cursor: "pointer" }}>
                        {repost.name}
                      </span>
                    </Link>
                    <br />
                    {
                      <TimeAgo
                        style={{ fontSize: "0.8em" }}
                        datetime={new Date(
                          repost.timestamp.toDate()
                        ).toLocaleString()}
                      />
                    }
                  </span>
                </>
              ) : (
                <>
                  <img
                    src={image}
                    width="40"
                    height="40"
                    className="rounded m-1"
                    alt=""
                  />

                  <span className="px-2">
                    <Link href={`${router.basePath}/user/${uid}`}>
                      <span style={{ fontSize: "1.1em", cursor: "pointer" }}>
                        {name}
                      </span>
                    </Link>
                    <br />
                    {timeStamp}
                  </span>
                </>
              )}
              {showUserOptions && (
                <Button
                  variant="outline-danger ms-auto"
                  className="p-2"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Post
                </Button>
              )}
            </div>
          </Card.Text>
          <Card.Text as="div" className="p-0 mt-2 ms-2">
            {message}
          </Card.Text>
        </Card.Body>

        {postImages && (
          <Card.Img
            variant="bottom"
            src={postImages}
            className={`${classes.ph} ${classes.phr}`}
          />
        )}

        <Card.Footer className="d-flex justify-content-start">
          <Button
            variant="info"
            className="m-1"
            onClick={() => setShowComments(true)}
          >
            Comments ({comments.length})
          </Button>
          <Button
            variant={`${hasLiked ? "light" : "outline-light"}`}
            className="m-1"
            onClick={toggleLiked}
            disabled={disableLikeButton}
          >
            Like ({likes.length})
          </Button>
          {user.email != email && (
            <Button
              className="m-1 ms-auto"
              variant="primary"
              onClick={() => setShowRepostModal(true)}
            >
              Repost
            </Button>
          )}
        </Card.Footer>
      </Card>
    </Fragment>
  );
}

export default Post;
