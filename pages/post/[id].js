import { useRouter } from "next/router";
import { db } from "../../firebase";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { useDocumentData } from "react-firebase-hooks/firestore";
import getUser from "../../components/Actions/getUser";

function ViewPost() {
  const router = useRouter();
  const user = getUser();

  const [ref, loading, error] = useDocumentData(
    db.collection("posts").doc(router.query.id)
  );

  if (error) {
    return <div>No data.</div>;
  }

  return (
    <Box sx={{ width: { md: "65vw", sm: "100vw" }, mx: "auto" }}>
      <List>
        {ref?.comments.length > 0 ? (
          comments.map(function (comment, i) {
            return (
              <ListItem
                key={i}
                secondaryAction={
                  user.email === comment.email ? (
                    <Button onClick={() => deleteCommentHandler(comment)}>
                      Delete
                    </Button>
                  ) : null
                }
              >
                <ListItemText
                  primary={comment.name}
                  secondary={comment.comment}
                />
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText primary="Be the first one to comment..." />
          </ListItem>
        )}
      </List>
    </Box>
  );
}

export default ViewPost;
