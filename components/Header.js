import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useRouter } from "next/router";

function Header() {
  const [session] = useSession();
  const router = useRouter();

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand className="fs-2" onClick={() => router.push("/")}>
          Global Social
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="d-flex">
            <Nav.Item className="d-inline">
              <Image
                src={session.user.image}
                className="rounded-full"
                width={40}
                height={40}
                layout="fixed"
              />

              <span className="mx-3 p-1 my-auto">{session.user.name}</span>
            </Nav.Item>

            <Nav.Item>
              <Button className="mx-2" variant="outline-dark" onClick={signOut}>
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
