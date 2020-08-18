import React, { Component } from "react";
import { Modal, Form, Input, Message, Button } from "semantic-ui-react";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";

class UpdateArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      formError: false,
      errorMessage: "",
      area: {
        areaId: "",
        areaName: "",
      },
    };
  }

  toggleAdding = () => {
    this.setState({
      adding: !this.state.adding,
    });
  };

  clearForm = () => {
    this.setState({
      formError: false,
      area: {
        areaId: "",
        areaName: "",
      },
    });
  };

  close = () => {
    this.clearForm();
    this.props.close();
  };

  areaNameChangeHandler = (e) => {
    this.setState({
      area: {
        ...this.state.area,
        areaName: e.target.value,
      },
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.area.areaId !== nextProps.area.areaId ||
      this.props.open !== nextProps.open ||
      this.state !== nextState
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.area.areaId !== prevProps.area.areaId ||
      this.props.open !== prevProps.open
    ) {
      const { area } = this.props;
      this.setState({
        area: {
          areaId: area.areaId,
          areaName: area.areaName,
        },
      });
    }
  }

  updateArea = () => {
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
            console.log(response.data.result[0]);
            this.props.update(response.data.result[0]);
            this.close();
          }
          this.close();
        })
        .catch((err) => {
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
        <Modal.Header>Update Area</Modal.Header>
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
            onClick={this.updateArea}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default UpdateArea;
