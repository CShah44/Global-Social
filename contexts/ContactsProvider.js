import { useContext, createContext } from "react";
import { db } from "../firebase";

const ContactsContext = createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

async function getContacts() {
  const contactsSnapshot = await db.collection("contacts").get();
  const contacts = [];

  contactsSnapshot.forEach((doc) => {
    let contact = { id: doc.data().id, name: doc.data().name };

    contacts.push(contact);
  });

  return contacts;
}

export function ContactsProvider({ children }) {
  const contacts = getContacts();

  function createContact(id, name) {
    db.collection("contacts")
      .add({ id, name })
      .catch((err) => {
        console.log("Error adding up a new Contact!", err);
      });
  }

  const value = { contacts, createContact };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}
