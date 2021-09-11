import { db } from "../../firebase";

function ChatRoom({ room }) {
  const roomRef = db.collection("rooms").doc(room);

  return (
    <div className="text-white">
      I HAVE TO ADD A BACK BUTTON ALSO. THIS IS ROOM PROP OBJECT:
    </div>
  );
}

export default ChatRoom;
