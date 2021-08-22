import { Modal, Button } from "react-bootstrap";

function ConfirmRepost({ repost, show, hideModal }) {
  return (
    <Modal className="normal" show={show} centered onHide={hideModal}>
      <Modal.Header>
        <Modal.Title>Confirm Repost</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to repost? 😎</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={repost}>
          Yes, Repost it!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmRepost;
