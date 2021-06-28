import { Fragment, useState } from "react";
import { Card, Button } from "react-bootstrap";
import CommentsModal from "./UserFeedback/CommentsModal";
import TimeAgo from "timeago-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, FieldValue, storage } from "../firebase";
import DeletePostModal from "./UserFeedback/DeletePostModal";

function Post({
  name,
  email,
  message,
  image,
  postImage,
  timestamp,
  id,
  comments,
  likes,
  showDeleteButton,
  repost,
}) {
  const [showComments, setShowComments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [user] = useAuthState(auth);

  const hasLiked = likes.includes(user.email);

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
    const postRef = db.collection("posts").doc(id);

    if (hasLiked) {
      postRef
        .update({
          likes: FieldValue.arrayRemove(user.email),
        })
        .catch(alert);
      return;
    }

    postRef
      .update({
        likes: FieldValue.arrayUnion(user.email),
      })
      .catch(alert);
  }

  function deletePostHandler() {
    hideDeletePostModal();
    db.collection("posts")
      .doc(id)
      .delete()
      .then((res) => {
        // TODO: SHOW A TOAST
        console.log(res);
      })
      .catch((err) => {
        // TODO: SHOW A TOAST
        console.log(err);
      });

    if (postImage) {
      // DELETE THE IMAGE
      storage.refFromURL(postImage).delete().catch(alert);
    } else return;
  }

  function processRepostHeader() {
    if (repost) {
      const repostName = repost.name;
      const repostTime = repost.timestamp;
      // const repostEmail = repost.email;

      return (
        <Card.Header>
          Originally posted by <strong> {repostName}</strong>,{" "}
          {
            <TimeAgo
              datetime={new Date(repostTime.toDate()).toLocaleString()}
            />
          }
        </Card.Header>
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
        timestamp: FieldValue.serverTimestamp(),
        comments: [],
        likes: [],
        repost: {
          name: name,
          timestamp: timestamp,
          email: email,
        },
      })
      .catch(alert);
  }

  return (
    <Fragment>
      <CommentsModal
        comments={comments}
        hideModal={hideCommentsModal}
        show={showComments}
        id={id}
      />

      <DeletePostModal
        id={id}
        hideModal={hideDeletePostModal}
        show={showDeleteModal}
        deletePost={deletePostHandler}
      />

      <Card className="w-90 my-5">
        {processRepostHeader()}
        <Card.Body>
          <Card.Text as="div">
            <div className="d-flex flex-grow-1">
              <img
                src={image}
                width="40"
                height="40"
                className="rounded m-1"
                alt=""
              />
              <span className="px-2">
                <span style={{ fontSize: "1.1em" }}>{name}</span>
                <br />
                {timeStamp}
              </span>

              {showDeleteButton && (
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
          <Card.Text as="div" className="p-0 mt-2">
            {message}
          </Card.Text>
        </Card.Body>
        <Card.Img variant="bottom" src={postImage} />
        <Card.Footer className="d-flex justify-content-start">
          <Button
            variant="outline-dark"
            className="m-1"
            onClick={() => setShowComments(true)}
          >
            View Comments ({comments.length})
          </Button>
          <Button
            variant={`${hasLiked ? "primary" : "outline-primary"}`}
            className="m-1"
            onClick={toggleLiked}
          >
            Like ({likes.length})
          </Button>
          {user.email != email && (
            <Button
              className="m-1 ms-auto"
              variant="primary"
              onClick={repostHandler}
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
