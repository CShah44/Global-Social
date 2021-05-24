import Link from "next/link";
import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import Login from "./Login";

function Header() {
  const [session] = useSession();

  if (!session) {
    return <Login />;
  }

  return (
    <div className="sticky top-0 bg-white flex justify-between content-center shadow-md">
      {/* Left */}

      <h3 className="text-4xl font-sans flex-auto p-2 mr-2 justify-start">
        GLOBAL SOCIAL
      </h3>

      {/* Center - Links for chat or posts feed */}
      <div className="flex-auto self-center">
        <Link href="/">Feed/Posts</Link>
        <Link href="/">Chat</Link>
      </div>

      {/* Right */}
      <div className="flex items-center sm:space-x-2 justify-end">
        <Image
          onClick={signOut}
          src={session.user.image}
          className="rounded-full cursor-pointer"
          width={40}
          height={40}
          layout="fixed"
        />

        <p className="whitespace-nowrap font-semibold pr-2">
          {session.user.name}
        </p>
      </div>
    </div>
  );
}

export default Header;
