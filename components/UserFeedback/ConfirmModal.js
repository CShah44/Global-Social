import { Modal, Button } from "react-bootstrap";

function ConfirmModal({ func, show, hideModal, text, title }) {
  return (
    <Modal className="normal" show={show} centered onHide={hideModal}>
      <Modal.Header>
        <Modal.Title> {title} </Modal.Title>
      </Modal.Header>
      <Modal.Body> {text} </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={func}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
