import { db } from "../../firebase";
import { ListGroup, Card } from "react-bootstrap";
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";

function ChatList({ name, id }) {
  const [yourRooms] = useCollection(
    db
      .collection("rooms")
      .where("users", "array-contains", { name: name, id: id })
  );
  return (
    <Card
      bg="dark"
      text="light"
      style={{ width: "65vw" }}
      className="d-flex flex-column normal newEff my-3 mx-auto"
    >
      <h1 className="text-white text-bold p-3 heading">Your Chats</h1>

      <ListGroup variant="flush" className="p-2">
        {yourRooms?.docs?.length > 0 ? (
          yourRooms.docs?.map((doc, index) => {
            return (
              <Link key={index} href={`chat/${doc.id}`}>
                <ListGroup.Item>{doc.id}</ListGroup.Item>
              </Link>
            );
          })
        ) : (
          <div className="p-2"> You haven't joined any chat rooms yet! </div>
        )}
      </ListGroup>
    </Card>
  );
}

export default ChatList;
