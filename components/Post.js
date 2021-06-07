import { Card, Text } from "react-bootstrap";

function Post({ name, message, image, postImage, email, timestamp }) {
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

            <span className="d-flex flex-row align-items-center justify-content-between">
              <span style={{ fontSize: "1.1em" }} className="px-2">
                {name}
                {timestamp ? (
                  <span style={{ fontSize: "0.8em" }}>
                    {new Date(timestamp?.toDate()).toLocaleString()}
                  </span>
                ) : (
                  <span>Loading...</span>
                )}
              </span>
            </span>
          </div>
        </Card.Text>
        <Card.Text className="p-0 m-0">{message}</Card.Text>
      </Card.Body>
      <Card.Img variant="bottom" src={postImage} />
    </Card>
  );
}

export default Post;
