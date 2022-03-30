import { Stack, CircularProgress } from "@mui/material";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import Post from "./Post";

function Feed() {
  const [snap, loading] = useCollection(
    query(collection(db, "posts"), orderBy("timestamp", "desc"))
  );

  return (
    <>
      <Stack
        sx={{
          width: { xs: "100vw", sm: "500px", md: "650px" },
          my: "3em",
          mx: "auto",
        }}
        spacing={2}
      >
        {loading && <CircularProgress />}
        {snap &&
          snap?.docs.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              name={post.data().name}
              message={post.data().message}
              email={post.data().email}
              timestamp={post.data().timestamp}
              image={post.data().image}
              likes={post.data().likes}
              showDeleteButton={false}
              repost={post.data().repost}
              uid={post.data().uid}
              postImage={post.data().postImage}
            />
          ))}
      </Stack>
    </>
  );
}

export default Feed;
