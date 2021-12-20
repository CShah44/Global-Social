import { Stack } from "@mui/material";
import InputBox from "./InputBox";
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
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <InputBox />

      <Posts />
    </Stack>
  );
}

export default Feed;
