import Head from "next/head";
import { Button, Typography, Box } from "@mui/material";
import Link from "next/link";
import Feed from "../components/Feed";
import Navbar from "../components/NavBar";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <Box className="darkbg text-white">
      <Head>
        <title>Global Social</title>
      </Head>
      <Toaster position="bottom-center" />
      <Navbar />
      <Feed />
    </Box>
  );
}
