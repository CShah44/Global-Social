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
        <Typography variant="h4" sx={{ mx: "auto", mt: 4 }}>
          Your Feed
        </Typography>
        <Feed />
      </Stack>
    </>
  );
}
