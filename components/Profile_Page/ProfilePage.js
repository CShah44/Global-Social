import UserPosts from "./UserPosts";
import InputBox from "../InputBox";
import { Card } from "react-bootstrap";
import { useSession } from "next-auth/client";

export default function ProfilePage({ posts }) {
  const [session] = useSession();

  return (
    <div className="d-flex flex-column justify-content-center">
      <Card
        style={{ width: "65vw" }}
        className="mb-4 d-flex flex-column justify-content-center align-items-center p-5 fs-5"
      >
        <Card.Body>
          <Card.Title className="fs-2">Hi, {session.user.name} </Card.Title>
          <Card.Subtitle className="mb-1 text-muted">
            {session.user.email}
          </Card.Subtitle>
          <Card.Text>
            Welcome to your profile page. You can see your posts or add a new
            one here!
          </Card.Text>
        </Card.Body>
      </Card>
      <InputBox className="my-2" />
      <UserPosts posts={posts} />
    </div>
  );
}
