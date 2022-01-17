import toast from "react-hot-toast";
import { db, FieldValue, storage } from "../../firebase";

export function toggleLiked(user, id) {
  const postRef = db.collection("posts").doc(id);
  db.runTransaction(async (transaction) => {
    return await transaction.get(postRef).then((doc) => {
      const hasLiked = doc.data().likes.includes(user.email);

      transaction.update(postRef, {
        likes: hasLiked
          ? FieldValue.arrayRemove(user.email)
          : FieldValue.arrayUnion(user.email),
      });
    });
  }).catch(() => toast.error("Couldn't Like the post 😐"));
}

export function deletePostHandler(id, postImages) {
  let x = false;

  const ref = db.collection("posts").doc(id);

  const p = db.runTransaction(async (transaction) => {
    return await transaction.get(ref).then((doc) => {
      if (postImages) {
        if (doc.data().repost != null) {
          return;
        } else {
          return (x = true);
        }
      }

      transaction.delete(ref).then(() => {
        if (x) {
          storage
            .refFromURL(postImages)
            .delete()
            .catch((e) => console.log(e));
        }
      });
    });
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
