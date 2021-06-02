import React, { useContext, useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import { useContacts } from "./ContactsProvider";
import { useSocket } from "./SocketProvider";

const ConversationsContext = React.createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

async function getConversations() {
  const conversationSnapshot = await db
    .collection("conversations")
    .get()
    .catch((err) => {
      console.log(err);
      return;
    });
  const conversations = [];

  conversationSnapshot
    .forEach((doc) => {
      let conversation = {
        recipients: doc.data().recipients,
        messages: doc.data().messages,
      };

      conversations.push(conversation);
    })
    .then(() => {
      return conversations;
    })
    .catch((err) => {
      console.log(err);
      return;
    });
}

export function ConversationsProvider({ id, children }) {
  let conversations = [];

  conversations = getConversations();

  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
  const { contacts } = useContacts();
  const socket = useSocket();

  function createConversation(recipients) {
    db.collection("conversations")
      .add({ recipients, messages: [] })
      .catch((err) => console.log(err));
  }

  const addMessageToConversation = ({ recipients, text, sender }) => {
    db.collection("conversations")
      .where("recipients", "==", recipients)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.update({ message: { text, sender } });
        });
      });
  };

  useEffect(() => {
    if (socket == null) return;

    socket.on("receive-message", addMessageToConversation);

    return () => socket.off("receive-message");
  }, [socket, addMessageToConversation]);

  function sendMessage(recipients, text) {
    socket.emit("send-message", { recipients, text });

    addMessageToConversation({ recipients, text, sender: id });
  }

  const formattedConversations = conversations.map((conversation, index) => {
    const recipients = conversation.recipients.map((recipient) => {
      const contact = contacts.find((contact) => {
        return contact.id === recipient;
      });
      const name = (contact && contact.name) || recipient;
      return { id: recipient, name };
    });

    const messages = conversation.messages.map((message) => {
      const contact = contacts.find((contact) => {
        return contact.id === message.sender;
      });
      const name = (contact && contact.name) || message.sender;
      const fromMe = id === message.sender;
      return { ...message, senderName: name, fromMe };
    });

    const selected = index === selectedConversationIndex;
    return { ...conversation, messages, recipients, selected };
  });

  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    sendMessage,
    selectedConversationIndex: setSelectedConversationIndex,
    createConversation,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}
