import toast from "react-hot-toast";
import { db } from "../../firebase";
import {
  arrayRemove,
  arrayUnion,
  runTransaction,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

export function toggleLiked(user, id) {
  const postRef = doc(db, "posts", id);

  runTransaction(db, async (transaction) => {
    return await transaction.get(postRef).then((doc) => {
      const hasLiked = doc.data().likes.includes(user.email);

      transaction.update(postRef, {
        likes: hasLiked ? arrayRemove(user.email) : arrayUnion(user.email),
      });
    });
  }).catch(() => toast.error("Couldn't Like the post 😐"));
}

export function deletePostHandler(id) {
  const docDeleteRef = doc(db, `posts/${id}`);
  const p = deleteDoc(docDeleteRef);

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
  postImage,
  image
) {
  //Repost object contains original data.
  const p = addDoc(collection(db, "posts"), {
    message: message,
    name: user.displayName,
    email: user.email,
    image: user.photoURL,
    uid: user.uid,
    postImage: postImage ? postImage : null,
    timestamp: serverTimestamp(),
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
