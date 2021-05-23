import { signIn } from "next-auth/client";

function Login() {
  return (
    <div className="grid place-items-center">
      {/* todo : ADD IMAGE */}
      <h1
        onClick={signIn}
        className="p-5 bg-blue-500 rounded-full text-white text-center cursor-pointer"
      >
        Login with Google
      </h1>
    </div>
  );
}

export default Login;
