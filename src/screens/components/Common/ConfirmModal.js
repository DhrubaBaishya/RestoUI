import React, { Component } from "react";
import { Modal, Button } from "semantic-ui-react";

class ConfirmModal extends Component {
  render() {
    const { open, header, content, close, confirm, color } = this.props;
    return (
      <Modal size="mini" open={open} onClose={close}>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>{content}</Modal.Content>
        <Modal.Actions>
          <Button onClick={close}>Cancel</Button>
          <Button color={color} onClick={confirm}>
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ConfirmModal;
