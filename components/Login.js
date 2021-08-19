import { Button } from "react-bootstrap";
import { auth, provider } from "../firebase";
import Image from "next/image";

function Login() {
  function signIn() {
    auth.signInWithPopup(provider).catch(alert);
  }

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "100vh", backgroundColor: "black" }}
    >
      <div className="mx-auto mt-4">
        <Image
          src="/Logo.png"
          width="500"
          className="border border-white"
          height="500"
        />
      </div>
      <div className="mx-auto m-2">
        <Button onClick={signIn} className="mx-1" variant="light">
          Login with Google
        </Button>
        <Button className="mx-2" variant="light">
          Login with Twitter
        </Button>
        <Button variant="light" className="mx-1">
          Login with Facebook
        </Button>
      </div>
    </div>
  );
}

export default Login;
