import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

function ChatScreen() {
  const [session] = useSession();
  const router = useRouter();

  return (
    <div>
      <div>
        <img src="" alt="" />
        <div>
          <h3></h3>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
