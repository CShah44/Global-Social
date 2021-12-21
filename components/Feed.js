import { Stack } from "@mui/material";
import Posts from "./Posts";

function Feed() {
  return (
    <Stack
      marginBottom="5em"
      display="flex"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{
        width: { xs: "100vw", md: "65vw" },
        my: "5em",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Posts />
    </Stack>
  );
}

export default Feed;
