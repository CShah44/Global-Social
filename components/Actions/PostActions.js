import toast from "react-hot-toast";
import { db, FieldValue, storage } from "../../firebase";

export function toggleLiked(user, id, likes, setDisableLikeButton) {
  const hasLiked = likes.includes(user.email);
  const postRef = db.collection("posts").doc(id);

  setDisableLikeButton(true);

  postRef
    .update({
      likes: hasLiked
        ? FieldValue.arrayRemove(user.email)
        : FieldValue.arrayUnion(user.email),
    })
    .then(() => {
      setTimeout(() => {
        setDisableLikeButton(false);
      }, 1500);
    })
    .catch(() => toast.error("Couldn't Like the post 😐"));
}

export function deletePostHandler(id, postImages) {
  const p = db
    .collection("posts")
    .doc(id)
    .delete()
    .then(() => {
      if (postImages) {
        return storage.refFromURL(postImages).delete();
      }
    });

  toast.promise(p, {
    loading: "Deleting..",
    success: "Post Deleted!",
    error: "Couldn't delete post. 😐",
  });
}

export function repostHandler(
  user,
  name,
  message,
  uid,
  timestamp,
  postImages,
  image
) {
  //Repost object contains original data.
  const p = db.collection("posts").add({
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
      image: image,
    },
  });

  toast.promise(p, {
    loading: "Reposting...",
    success: "Reposted! Cheers! 😄",
    error: "Couldn't Repost. 😐",
  });
}
