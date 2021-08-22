import { Button } from "react-bootstrap";
import { auth, provider } from "../firebase";
import Image from "next/image";

function Login() {
  function signIn() {
    auth.signInWithPopup(provider).catch(alert);
  }

  return (
    <div className="d-flex flex-column" style={{ maxHeight: "100vh" }}>
      <div className="mx-auto mt-4">
        <Image
          src="/Logo.png"
          width="500"
          className="border border-white"
          height="500"
        />
      </div>
      <div className="mx-auto mt-3">
        <Button onClick={signIn} variant="light">
          Login with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
