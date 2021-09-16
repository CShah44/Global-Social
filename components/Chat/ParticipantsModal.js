import { Modal, Button, ListGroup } from "react-bootstrap";

function ParticipantsModal({ show, hideModal, leaveRoom, users }) {
  return (
    <Modal className="normal" show={show} centered onHide={hideModal}>
      <Modal.Header>
        <Modal.Title> Participants </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {users.map((user) => (
            <ListGroup.Item key={user.id}> {user.name} </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        This action cannot be undone.
        <Button onClick={hideModal}> Close </Button>
        <Button variant="outline-danger" onClick={leaveRoom}>
          Leave Room
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ParticipantsModal;
