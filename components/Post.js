import { Card, Text } from "react-bootstrap";

function Post({ name, message, image, postImage, email, timestamp }) {
  const timeStamp = timestamp ? (
    <span style={{ fontSize: "0.8em" }} className="px-2">
      {new Date(timestamp?.toDate()).toLocaleString()}
    </span>
  ) : (
    <span className="px-2" style={{ fontSize: "0.8em" }}>
      Loading...
    </span>
  );

  return (
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
                {name}
              </span>
              {timeStamp}
            </div>
          </div>
        </Card.Text>
        <Card.Text className="p-0 m-0">{message}</Card.Text>
      </Card.Body>
      <Card.Img variant="bottom" src={postImage} />
    </Card>
  );
}

export default Post;
