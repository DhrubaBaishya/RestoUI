import React, { Component } from "react";
import PrintOrder from "../PrintOrder";
import { Modal, Button, Icon } from "semantic-ui-react";
import ReactToPrint from "react-to-print";

class PrintModal extends Component {
  close = () => {
    this.props.close();
  };

  render() {
    const { open, order, table } = this.props;
    return (
      <Modal open={open} onClose={this.close} size="mini">
        <Modal.Content scrolling>
          <Modal.Description>
            <PrintOrder
              order={order}
              table={table}
              ref={(el) => (this.componentRef = el)}
            />
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

export default PrintModal;
