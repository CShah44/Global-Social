import { Fragment, useState } from "react";
import { Card, Button } from "react-bootstrap";
import CommentsModal from "./Modals/CommentsModal";
import TimeAgo from "timeago-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, FieldValue, storage } from "../firebase";
import DeletePostModal from "./Modals/DeletePostModal";

function Post({
  email,
  name,
  message,
  image,
  postImage,
  timestamp,
  id,
  comments,
  likes,
  showDeleteButton,
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
        <Card.Footer>
          <Button
            variant="outline-dark"
            className="p-2 me-2"
            onClick={() => setShowComments(true)}
          >
            View Comments ({comments.length})
          </Button>
          <Button
            variant={`${hasLiked ? "primary" : "outline-dark"}`}
            className="p-2"
            onClick={toggleLiked}
          >
            Like ({likes.length})
          </Button>
        </Card.Footer>
      </Card>
    </Fragment>
  );
}

export default Post;
