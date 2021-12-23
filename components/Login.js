import { Button, Box } from "@mui/material";
import { auth, provider } from "../firebase";
import Image from "next/image";

function Login() {
  function signIn() {
    auth.signInWithPopup(provider).catch(alert);
  }

  return (
    <Box
      sx={{
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box mx="auto" mt={4}>
        <Image
          src="/Logo.png"
          width="500"
          className="border border-white"
          height="500"
        />
      </Box>

      <Button
        sx={{ width: "250px", mx: "auto" }}
        onClick={signIn}
        variant="contained"
      >
        Login with Google
      </Button>
    </Box>
  );
}

export default Login;
