import Link from "next/link";
import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import Login from "./Login";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function Header() {
  const [session] = useSession();

  if (!session) {
    return <Login />;
  }

  return (
    <Navbar bg="light" variant="light" sticky="top" expand="sm">
      <Container>
        <Navbar.Brand className="fs-2">Global Social</Navbar.Brand>
        <Nav className="d-flex justify-content-center align-items-center fs-5">
          <Link href="/">
            <Button className="p-2" variant="light">
              Feed
            </Button>
          </Link>
          {"  "}

          <Link href="/chat">
            <Button className="p-2" variant="light">
              Chat
            </Button>
          </Link>
        </Nav>
        <Nav className="d-flex justify-content-center align-items-center">
          <Nav.Item>
            <Image
              src={session.user.image}
              className="rounded-full"
              width={40}
              height={40}
              layout="fixed"
            />
          </Nav.Item>
          <Nav.Item className="mx-3 p-1">{session.user.name}</Nav.Item>
          <Nav.Item>
            <Button className="mx-2" variant="outline-dark" onClick={signOut}>
              Sign Out
            </Button>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
