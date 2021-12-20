import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
} from "@mui/material";

function ConfirmModal({ func, show, hideModal, text, title }) {
  return (
    <Dialog className="normal" open={show} onClose={hideModal}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text} </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideModal}>Close</Button>
        <Button onClick={func} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
