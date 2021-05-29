import Link from "next/link";
import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import Login from "./Login";
import { Navbar, Nav, Container } from "react-bootstrap";

function Header() {
  const [session] = useSession();

  if (!session) {
    return <Login />;
  }

  return (
    <Navbar bg="light" variant="light" sticky="top" expand="lg">
      <Container>
        <Navbar.Brand>Global Social</Navbar.Brand>
        <Nav className="d-flex justify-content-center align-items-center">
          <Nav.Link>
            <Link href="/">Feed</Link>
          </Nav.Link>
          <Nav.Link>
            <Link href="/chat">Chat</Link>
          </Nav.Link>
        </Nav>
        <Nav className="d-flex justify-content-center align-items-center">
          <Nav.Item>
            <Image
              onClick={signOut}
              style={{ cursor: "pointer" }}
              src={session.user.image}
              className="rounded-full"
              width={40}
              height={40}
              layout="fixed"
            />
          </Nav.Item>
          <Nav.Item className="mx-1">{session.user.name}</Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
