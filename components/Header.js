import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Image from "next/image";
import Link from "next/link";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useRouter } from "next/router";

function Header() {
  const [user] = useAuthState(auth);

  const router = useRouter();

  function processSignOut() {
    auth.signOut();
    router.replace("/");
  }

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container className="d-flex">
        <Link href="/" shallow={true}>
          <Navbar.Brand className="fs-2" style={{ cursor: "pointer" }}>
            Global Social
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item className="d-inline-flex justify-content-center align-items-center">
              <Image
                src={user.photoURL}
                className="rounded-full"
                width={40}
                height={40}
                layout="fixed"
              />

              <span className="mx-3 p-1">{user.displayName}</span>
            </Nav.Item>
            <Nav.Item className="m-2">
              <Link href={`${router.basePath}/user/${user.uid}`}>
                <Button variant="outline-dark">Your Profile</Button>
              </Link>
            </Nav.Item>
            <Nav.Item className="m-2">
              <Button variant="outline-dark" onClick={processSignOut}>
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
