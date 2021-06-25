import {
  Button,
  Modal,
  ListGroup,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { db, FieldValue, auth } from "../firebase";
import { useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function CommentsModal({ id, show, comments, hideModal }) {
  const inputRef = useRef(null);
  const [user] = useAuthState(auth);

  function addCommentHandler(e) {
    e.preventDefault();

    if (!inputRef.current.value) return;

    db.collection("posts")
      .doc(id)
      .update({
        comments: FieldValue.arrayUnion({
          name: user.displayName,
          comment: inputRef.current.value,
          email: user.email,
        }),
      })
      .catch(alert);

    inputRef.current.value = "";
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

  return (
    <Modal show={show} onHide={hideModal} centered>
      <Modal.Header>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {comments.length > 0 ? (
            comments.map(function (comment) {
              return (
                <ListGroup.Item className="d-flex p-1 py-2">
                  <span className="fw-bold me-2">{comment.name}</span>{" "}
                  {comment.comment}
                  {user.email === comment.email && (
                    <Button
                      variant="outline-danger"
                      className="ms-auto"
                      onClick={() => deleteCommentHandler(comment)}
                    >
                      Delete
                    </Button>
                  )}
                </ListGroup.Item>
              );
            })
          ) : (
            <ListGroup.Item className="fw-bold fs-4">
              {" "}
              Be the first one to comment!{" "}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <InputGroup className="flex-fill p-2">
          <FormControl
            as="textarea"
            maxLength={50}
            ref={inputRef}
            style={{ resize: "none" }}
            placeholder="Add a comment"
          />
          <Button type="submit" onClick={addCommentHandler}>
            Add
          </Button>
        </InputGroup>
      </Modal.Footer>
    </Modal>
  );
}

export default CommentsModal;
