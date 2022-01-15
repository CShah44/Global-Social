import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";

const authCtx = createContext();

export function useAuth() {
  return useContext(authCtx);
}

export function AuthProvider({ children }) {
  const authUser = useFirebaseUser();
  return <authCtx.Provider value={authUser}>{children}</authCtx.Provider>;
}

function useFirebaseUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);

        db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              return;
            } else {
              db.collection("users").doc(user.uid).set(
                {
                  name: user.displayName,
                  about: "Hey there, I am using Global Social!",
                  email: user.email,
                  followers: [],
                  following: [],
                  photoURL: user.photoURL,
                },
                { merge: true }
              );
            }
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return {
    user,
    loading,
  };
}
