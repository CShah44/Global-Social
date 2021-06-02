import { ListGroup } from "react-bootstrap";
import { useConversations } from "../../contexts/ConversationsProvider";

export default function Conversations() {
  const { conversations, selectedConversationIndex } = useConversations();

  return (
    <ListGroup variant="flush">
      {conversations.map((conversation, index) => {
        <ListGroup.Item
          key={index}
          action
          onClicK={() => selectedConversationIndex(index)}
          active={conversation.selected}
        >
          {conversation.recipients.map((r) => r.name).join(", ")}
        </ListGroup.Item>;
      })}
    </ListGroup>
  );
}
