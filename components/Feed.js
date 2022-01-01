import { Stack, Typography, Button } from "@mui/material";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Post from "./Post";

function Feed() {
  const [realtimePosts, loading] = useCollection(
    db.collection("posts").orderBy("timestamp", "desc")
  );

  return (
    <Stack
      sx={{ width: { xs: "100vw", md: "650px" }, my: "5em", mx: "auto" }}
      spacing={1}
    >
      {realtimePosts &&
        realtimePosts?.docs.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            name={post.data().name}
            message={post.data().message}
            email={post.data().email}
            timestamp={post.data().timestamp}
            image={post.data().image}
            comments={post.data().comments}
            likes={post.data().likes}
            showDeleteButton={false}
            repost={post.data().repost}
            uid={post.data().uid}
          />
        ))}
    </Stack>
  );
}

export default Feed;
