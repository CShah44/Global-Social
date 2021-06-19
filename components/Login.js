import { Button } from "react-bootstrap";
import { auth, provider } from "../firebase";

function Login() {
  function signIn() {
    auth.signInWithPopup(provider).catch(alert);
  }

  return (
    <div className="d-grid place-items-center">
      <Button onClick={signIn} variant="dark">
        Login with Google
      </Button>
    </div>
  );
}

export default Login;
