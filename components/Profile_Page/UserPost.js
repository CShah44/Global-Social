import { Fragment } from "react";
import { useState } from "react";
import { Card, Button } from "react-bootstrap";

function UserPost({ message, image, postImage, timestamp, id }) {
  const [showModal, setShowModal] = useState(false);

  const timeStamp = timestamp ? (
    <span style={{ fontSize: "0.8em" }} className="px-2">
      {new Date(timestamp?.toDate()).toLocaleString()}
    </span>
  ) : (
    <span className="px-2" style={{ fontSize: "0.8em" }}>
      Loading...
    </span>
  );

  function deletePostHandler() {
    setShowModal(false);

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
  }

  return (
    <Fragment>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="outline-danger" onClick={deletePostHandler}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="w-90 my-5">
        <Card.Body>
          <Card.Text>
            <div className="d-flex flex-grow-1">
              <img
                src={image}
                width="40"
                height="40"
                className="rounded m-1"
                alt=""
              />

              <div className="d-flex flex-column">
                <span style={{ fontSize: "1.1em" }} className="px-2">
                  Posted by you at,
                </span>
                {timeStamp}
              </div>

              <Button
                variant="outline-danger"
                className="p-1"
                onClick={() => setShowModal(true)}
              >
                Delete Post
              </Button>
            </div>
          </Card.Text>
          <Card.Text className="p-0 m-0">{message}</Card.Text>
        </Card.Body>
        <Card.Img variant="bottom" src={postImage} />
      </Card>
    </Fragment>
  );
}

export default UserPost;
