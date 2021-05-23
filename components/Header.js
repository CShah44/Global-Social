import Link from "next/link";
function Header() {
  return (
    <div className="flex justify-between content-center">
      {/* Left */}

      <h3 className="text-4xl font-sans flex-1"> GLOBAL SOCIAL </h3>

      {/* Center - Links for chat or posts feed */}
      <div className="flex-1 self-center">
        <Link href="/"> Feed/Posts </Link>
        <Link href="/"> Feed/Posts </Link>
      </div>

      {/* Left */}
    </div>
  );
}

export default Header;
