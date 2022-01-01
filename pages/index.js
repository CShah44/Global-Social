import Head from "next/head";
import { ToastProvider } from "react-toast-notifications";
import { Button, Typography, Box } from "@mui/material";
import Link from "next/link";
import Feed from "../components/Feed";
import Navbar from "../components/NavBar";

export default function Home() {
  return (
    <Box className="darkbg text-white">
      <Head>
        <title>Global Social</title>
      </Head>
      <Navbar />
      <ToastProvider placement="bottom-center" autoDismiss>
        <Feed />
      </ToastProvider>
    </Box>
  );
}
