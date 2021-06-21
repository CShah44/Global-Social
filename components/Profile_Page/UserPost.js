import { Fragment } from "react";
import { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { db } from "../../firebase";

function UserPost({ message, postImage, timestamp, id }) {
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
    <Card className="">
      <Card.Body>
        <Card.Text as="div">
          <div className="d-flex flex-grow-1">
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
        <Card.Text as="div" className="p-0 m-0">
          {message}
        </Card.Text>
      </Card.Body>
      <Card.Img variant="bottom" src={postImage} />
    </Card>
  );
}

export default UserPost;
