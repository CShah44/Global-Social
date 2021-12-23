import { useContext } from "react";
import CurrentUser from "../../contexts/CurrentUser";

export default function getUser() {
  const currentUser = useContext(CurrentUser);
  const user = currentUser.user;

  return user;
}
