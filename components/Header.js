import { auth } from "../firebase";
import Image from "next/image";
import Link from "next/link";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useContext } from "react";
import CurrentUser from "../contexts/CurrentUser";

function Header() {
  const currentUser = useContext(CurrentUser);
  const user = currentUser.user;

  const router = useRouter();

  function processSignOut() {
    auth.signOut();
    router.replace("/");
  }

  return (
    <Navbar
      className="glassyheader"
      variant="dark"
      text="light"
      expand="lg"
      sticky="top"
    >
      <Container className="d-flex normal text-white">
        <Link href="/" shallow={true}>
          <Navbar.Brand
            className="fs-1 heading d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <Image
              className="align-self-center border-white"
              src="/button.png"
              height="50"
              width="50"
            />
            <span className="ms-2">Global Social</span>
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

              <span className="mx-3 p-1 ">{user.displayName}</span>
            </Nav.Item>
            <Nav.Item className="m-2">
              <Link href={`${router.basePath}/user/${user.uid}`}>
                <Button variant="primary">Your Profile</Button>
              </Link>
            </Nav.Item>
            <Nav.Item className="m-2">
              <Button variant="primary" onClick={processSignOut}>
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
