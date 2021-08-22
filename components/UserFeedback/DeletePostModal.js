import { Modal, Button } from "react-bootstrap";

function DeletePostModal({ show, hideModal, deletePost }) {
  return (
    <Modal
      className="normal"
      show={show}
      onHide={hideModal}
      backdrop="static"
      centered
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>Delete Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Cancel
        </Button>
        <Button variant="outline-danger" onClick={deletePost}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeletePostModal;
