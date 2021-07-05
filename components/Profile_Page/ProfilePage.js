import InputBox from "../InputBox";
import { Card, Image, InputGroup, FormControl, Button } from "react-bootstrap";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRef, useState } from "react";

export default function ProfilePage({ user, docId }) {
  const [currentUser] = useAuthState(auth);

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  function clearField(e) {
    e.preventDefault();
    setIsEditing(false);
    inputRef.current.value = "";
  }

  function updateAboutMe(e) {
    e.preventDefault();
    if (inputRef.current.value <= 10) return;

    setIsEditing(false);

    db.collection("users")
      .doc(docId)
      .update({
        about: inputRef.current.value,
      })
      .catch(alert);
  }

  let editButton;

  if (user.email === currentUser.email) {
    editButton = (
      <Button className="me-auto mt-2" onClick={() => setIsEditing(true)}>
        Edit
      </Button>
    );
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Card style={{ width: "65vw" }} className="my-4 fs-5">
        <Card.Body className="d-flex flex-column flex-wrap p-5">
          <div className="d-flex flex-row flex-wrap ">
            <Image
              className="me-3"
              src={user.photoURL}
              rounded
              fluid
              height={100}
              width={100}
            />
            <p>
              <span className="fs-2 m-3">Hi, {user.name}</span>
              <br />
              <span className="fs-5 m-3 text-muted">{user.email}</span>
            </p>
          </div>

          {isEditing ? (
            <div>
              <InputGroup className="flex-fill mt-3 mb-2">
                <FormControl
                  as="textarea"
                  maxLength={100}
                  ref={inputRef}
                  style={{ resize: "none" }}
                  placeholder="Lets see what changes do you make in your about section..."
                />
              </InputGroup>
              <Button
                className="me-1 px-3"
                onClick={updateAboutMe}
                type="submit"
              >
                Done
              </Button>
              <Button onClick={clearField} variant="warning">
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <Card.Text className="mb-2 mt-4">{user.about}</Card.Text>
              {editButton}
            </div>
          )}
        </Card.Body>
      </Card>

      {user.email === currentUser.email && <InputBox />}
    </div>
  );
}
