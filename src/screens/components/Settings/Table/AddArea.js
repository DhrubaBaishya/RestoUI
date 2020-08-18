import React, { Component } from "react";
import { Modal, Form, Button, Input, Message } from "semantic-ui-react";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";

class AddArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      formError: false,
      errorMessage: "",
      area: {
        areaName: "",
      },
    };
  }

  toggleAdding = () => {
    this.setState({
      adding: !this.state.adding,
    });
  };

  close = () => {
    this.setState({
      formError: false,
      area: {
        areaName: "",
      },
    });
    this.props.close();
  };

  areaNameChangeHandler = (e) => {
    this.setState({
      area: {
        areaName: e.target.value,
      },
    });
  };

  addArea = () => {
    const { area } = this.state;
    if (area.areaName === "" || area.areaName === null) {
      this.setState({
        formError: true,
        errorMessage: errorMessages.emptyAreaName,
      });
    } else {
      this.toggleAdding();
      Axios.post(urls.area, area, { headers: authHeader() })
        .then((response) => {
          this.toggleAdding();
          if (
            response.data !== null &&
            response.data.result !== null &&
            response.data.result.length > 0
          ) {
            this.props.add(response.data.result[0]);
          }
          this.close();
        })
        .catch((err) => {
          this.toggleAdding();
          console.log(err);
          this.toggleAdding();
          this.setState({
            formError: true,
            errorMessage: errorMessages.tryAgain,
          });
        });
    }
  };

  render() {
    const { area, formError, adding, errorMessage } = this.state;
    return (
      <Modal size="mini" open={this.props.open} onClose={this.close}>
        <Modal.Header>Area Details</Modal.Header>
        <Modal.Content>
          <Form error={formError}>
            <Form.Field
              control={Input}
              placeholder="Area Name"
              value={area.areaName}
              onChange={this.areaNameChangeHandler}
            />
            <Message error content={errorMessage} />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close} disabled={adding}>
            Cancel
          </Button>
          <Button
            positive
            icon="save"
            loading={adding}
            disabled={adding}
            labelPosition="right"
            content="Save"
            onClick={this.addArea}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AddArea;
