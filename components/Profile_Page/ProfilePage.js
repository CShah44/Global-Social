import UserPosts from "./UserPosts";
import InputBox from "../InputBox";
import { Card } from "react-bootstrap";
import Image from "next/image";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ProfilePage({ user }) {
  const [currentUser] = useAuthState(auth);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Card
        style={{ width: "65vw" }}
        className="my-4 d-flex flex-column align-items-center p-5 fs-5"
      >
        <Card.Body className="d-flex ">
          <div className="d-inline">
            <Image src={user.photoURL} height={100} width={100} />
            <Card.Title className="fs-2">Hi, {user.name} </Card.Title>
            <Card.Subtitle className="fs-5 my-1 text-muted">
              {user.email}
            </Card.Subtitle>
          </div>
          <Card.Text>{user.about}</Card.Text>
        </Card.Body>
      </Card>
      {user.email === currentUser.email && <InputBox />}
      <UserPosts user={user} />
    </div>
  );
}
