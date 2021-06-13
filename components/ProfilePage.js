import Posts from "./Posts";
import { Card } from "react-bootstrap";
import { useSession } from "next-auth/client";

export default function ProfilePage({ posts }) {
  const [session] = useSession();

  return (
    <div className="d-flex container-sm flex-column justify-content-center">
      <Card style={{ width: "65vw" }} className="mb-4">
        <Card.Body className="d-flex flex-column align-items-center p-5 fs-5">
          <Card.Title className="fs-2">Hi, {session.user.name} </Card.Title>
          <Card.Subtitle className="mb-1 text-muted">
            {session.user.email}
          </Card.Subtitle>
          <Card.Text>
            Welcome to your profile page. You can see all your posts here.
          </Card.Text>
        </Card.Body>
      </Card>
      <Posts posts={posts} />
    </div>
  );
}
