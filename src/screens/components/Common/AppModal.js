import React, { Component } from "react";
import { Modal, Button } from "semantic-ui-react";

class AppModal extends Component {
  render() {
    const { header, open, close, loading, save, children } = this.props;
    return (
      <Modal size="mini" open={open} onClose={close} closeOnDimmerClick={false}>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>{children}</Modal.Content>
        <Modal.Actions>
          <Button onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button
            positive
            icon="save"
            loading={loading}
            disabled={loading}
            labelPosition="right"
            content="Save"
            onClick={save}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AppModal;
