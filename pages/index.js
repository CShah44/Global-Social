import Head from "next/head";
import Header from "../components/Header";
import { ToastProvider } from "react-toast-notifications";
import { Button, Typography, Box } from "@mui/material";
import Link from "next/link";
import Feed from "../components/Feed";

export default function Home() {
  return (
    <div className="darkbg text-white">
      <Head>
        <title>Global Social</title>
      </Head>
      <Header />
      <ToastProvider placement="bottom-center" autoDismiss>
        <Box
          sx={{
            display: "flex",
            width: "65vw",
            mt: 5,
            justifyContent: "space-between",
            ml: "15em",
          }}
        >
          <Typography variant="h4">Your Feed</Typography>
          {/* TODO: ADD AN ICON HERE */}
          <Link href="/post">
            <Button variant="outlined">Create Post</Button>
          </Link>
        </Box>
        <Feed />
      </ToastProvider>
    </div>
  );
}
