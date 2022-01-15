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

export function deletePostHandler(id, postImages, canDeleteImage = Boolean()) {
  const p = db
    .collection("posts")
    .doc(id)
    .delete()
    .then(() => {
      if (canDeleteImage) {
        storage.refFromURL(postImages).delete();
      }
    })
    .catch((E) => {
      console.log(E);
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
