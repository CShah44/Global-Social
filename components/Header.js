import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function Header() {
  const [session] = useSession();

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container className="d-flex">
        <Link href="/">
          <Navbar.Brand className="fs-2">Global Social</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item className="d-inline-flex justify-content-center align-items-center">
              <Image
                src={session.user.image}
                className="rounded-full"
                width={40}
                height={40}
                layout="fixed"
              />

              <span className="mx-3 p-1">{session.user.name}</span>
            </Nav.Item>
            <Nav.Item className="m-2">
              <Link href="/profile">
                <Button variant="outline-dark">View Profile</Button>
              </Link>
            </Nav.Item>
            <Nav.Item className="m-2">
              <Button variant="outline-dark" onClick={signOut}>
                Sign Out
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
