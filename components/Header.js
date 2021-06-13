import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useRouter } from "next/router";

function Header() {
  const [session] = useSession();
  const router = useRouter();

  return (
    <Navbar bg="light" variant="light" sticky="top">
      <Container>
        <Navbar.Brand className="fs-2" onClick={() => router.push("/")}>
          Global Social
        </Navbar.Brand>
        <Nav className="d-flex justify-content-center align-items-center">
          <div
            onClick={() => router.push("/profile")}
            style={{ cursor: "pointer" }}
          >
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
          </div>

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
