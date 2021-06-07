import { signIn } from "next-auth/client";
import { Button } from "react-bootstrap";

function Login() {
  return (
    <div className="d-grid place-items-center">
      <Button onClick={signIn} variant="dark">
        Login with Google
      </Button>
    </div>
  );
}

export default Login;
