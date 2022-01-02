import { db } from "../../firebase";
import { useRef, useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import getUser from "../Actions/getUser";

export default function ProfilePage({ user, docId }) {
  const currentUser = getUser();

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
      .catch(() => {
        // addToast("Couldn't update your profile!", { appearance: "error" });
      });
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
    <div className="normal d-flex flex-column justify-content-center align-items-center">
      <Card
        style={{ width: "65vw" }}
        bg="dark"
        text="light"
        className="neuEff my-4 fs-5"
      >
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
            <>
              <Card.Text className="mb-2 mt-4">{user.about}</Card.Text>
              {editButton}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
