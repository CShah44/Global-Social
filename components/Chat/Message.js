import TimeAgo from "timeago-react";

function Message({ message, userId }) {
  const { createdAt, text, id, name } = message;

  const messageClass =
    id === userId
      ? "bg-info bg-gradient ms-auto"
      : "bg-light bg-gradient me-auto";

  return (
    <div
      className={`my-2 text-break flex-column text-dark ${messageClass} d-flex justify-content-center align-items-center
       p-2`}
      style={{ maxWidth: "350px", borderRadius: "20px" }}
    >
      <div style={{ fontSize: "0.9em" }}>
        {name},{" "}
        <TimeAgo datetime={new Date(createdAt?.toDate()).toLocaleString()} />
      </div>

      <div style={{ fontSize: "1.1em" }}>{text}</div>
    </div>
  );
}

export default Message;
