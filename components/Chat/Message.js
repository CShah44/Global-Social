import moment from "moment";
import { useSession } from "next-auth/client";

function Message({ user, message }) {
  const [session] = useSession();

  const TypeOfMessage = user === session.user.email ? Sender : Reciever;

  return (
    <div>
      {message.message}
      <span className="p-3">
        {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
      </span>
    </div>
  );
}

export default Message;
