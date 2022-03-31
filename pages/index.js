import Head from "next/head";
import { Typography, Stack } from "@mui/material";
import Feed from "../components/Feed";
import Navbar from "../components/NavBar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Global Social</title>
      </Head>
      <Stack>
        <Navbar />
        <Feed />
      </Stack>
    </>
  );
}
