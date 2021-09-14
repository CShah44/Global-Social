import classes from "./Messages.module.css";

function Message({ message, userId }) {
  const { text, uid, name } = message;

  const messageClass = uid === userId ? "sent" : "received";

  return (
    <div className="text-white">
      {name}, {text}
    </div>
  );
}

export default Message;
