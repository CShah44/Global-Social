import { db, FieldValue, storage } from "../../firebase";

export function toggleLiked(user, id, likes) {
  const hasLiked = likes.includes(user.email);
  const postRef = db.collection("posts").doc(id);

  postRef
    .update({
      likes: hasLiked
        ? FieldValue.arrayRemove(user.email)
        : FieldValue.arrayUnion(user.email),
    })
    .then(() => {
      setTimeout(() => {
        // setDisableLikeButton(false);
      }, 1000);
    })
    .catch(() => console.log("Cannot like post right now bro"));
}

export function deletePostHandler(id, postImages) {
  db.collection("posts")
    .doc(id)
    .delete()
    .then(() => {
      if (postImages) {
        return storage.refFromURL(postImages).delete();
      }
    })
    .then(() => {
      console.log("Post deleted hehe");
    })
    .catch(() => {
      console.log("cannot delete post sorry");
    });
}

export async function repostHandler(
  user,
  name,
  message,
  uid,
  timestamp,
  postImages
) {
  await db
    .collection("posts")
    .add({
      message: message,
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
      uid: user.uid,
      postImages: postImages ? postImages : null,
      timestamp: FieldValue.serverTimestamp(),
      comments: [],
      likes: [],
      repost: {
        name: name,
        timestamp: timestamp,
        uid: uid,
      },
    })
    .then(() => {
      console.log("reposted hehe");
    })
    .catch(() => {
      console.log("cant repost lol");
    });
}
