import { ListGroup } from "react-bootstrap";
import {} from "../../contexts/ContactsProvider";

export default function Contacts() {
  const { contacts } = useContacts();

  return (
    <ListGroup variant="flush">
      {contacts.map((contact) => {
        <ListGroup.Item key={contact.id}>{contact.name}</ListGroup.Item>;
      })}
    </ListGroup>
  );
}
