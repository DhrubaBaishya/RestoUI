import React, { Component } from "react";
import { Modal, Button, Icon } from "semantic-ui-react";
import ReactToPrint from "react-to-print";
import Bill from "../Common/Bill";

class BillModal extends Component {
  close = () => {
    this.props.close();
  };

  render() {
    const { open, order } = this.props;
    return (
      <Modal open={open} onClose={this.close} size="mini">
        <Modal.Content scrolling>
          <Modal.Description>
            <Bill order={order} ref={(el) => (this.componentRef = el)} />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close}>Close</Button>
          <ReactToPrint
            trigger={() => (
              <Button primary>
                Print <Icon name="print right" />
              </Button>
            )}
            content={() => this.componentRef}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default BillModal;
