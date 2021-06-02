import { Card } from "react-bootstrap";

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

            <div className="d-flex flex-row align-items-center justify-content-between">
              <p style={{ fontSize: "1.1em" }} className="px-2">
                {name}
                {timestamp ? (
                  <p style={{ fontSize: "0.8em" }}>
                    {new Date(timestamp?.toDate()).toLocaleString()}
                  </p>
                ) : (
                  <p>Loading...</p>
                )}
              </p>
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
