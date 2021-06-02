import { Fragment } from "react";
import Sidebar from "../components/Chat/Sidebar";
import Header from "../components/Header";
import { ContactsProvider } from "../contexts/ContactsProvider";
import {
  ConversationsProvider,
  useConversations,
} from "../contexts/ConversationsProvider";
import { SocketProvider } from "../contexts/SocketProvider";
import OpenConversation from "../components/Chat/OpenConversation";

function chat() {
  // const { selectedConversation } = useConversations();

  return (
    <Fragment>
      <Header />
      <ContactsProvider>
        <ConversationsProvider>
          <SocketProvider>
            <div className="d-flex" style={{ height: "100vh" }}>
              <Sidebar />
              {/* {selectedConversation && <OpenConversation />} */}
            </div>
          </SocketProvider>
        </ConversationsProvider>
      </ContactsProvider>
    </Fragment>
  );
}

export default chat;
