import { Modal } from "react-bootstrap";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function EmojiPickerModal({ inputRef, show, hideModal }) {
  return (
    <Modal
      // style={{ height: "auto", width: "55rem" }}
      className="normal"
      show={show}
      onHide={hideModal}
    >
      <Picker
        set="google"
        enableFrequentEmojiSort
        perLine={15}
        theme="dark"
        onClick={(emo) => {
          inputRef.current.value += emo.native;
          return hideModal();
        }}
      />
    </Modal>
  );
}

export default EmojiPickerModal;
