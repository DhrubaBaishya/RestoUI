import React, { Component } from "react";
import { Modal, Form, Message, Button, Input } from "semantic-ui-react";
import { errorMessages, urls } from "../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../service/authHeader";

class AddAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      formError: false,
      error: "",
      person: {
        fullName: "",
        phoneNumber: "",
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
      person: {
        fullName: "",
        phoneNumber: "",
      },
    });
  };

  close = () => {
    this.clearForm();
    this.props.close();
  };

  fullNameChangeHandler = (e) => {
    this.setState({
      formError: false,
      person: {
        ...this.state.person,
        fullName: e.target.value,
      },
    });
  };

  phNumChangeHandler = (e) => {
    const re = /^[0-9\b]+$/;

    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({
        formError: false,
        person: {
          ...this.state.person,
          phoneNumber: e.target.value,
        },
      });
    }
  };

  addAccount = () => {
    const { person } = this.state;
    if (
      person.fullName === null ||
      person.fullName === "" ||
      person.phoneNumber === null ||
      person.phoneNumber === ""
    ) {
      this.setState({
        error: errorMessages.fieldEmpty,
        formError: true,
      });
    } else {
      this.toggleAdding();
      Axios.post(urls.person, person, { headers: authHeader() })
        .then((response) => {
          this.props.addPerson(response.data.result[0]);
          this.toggleAdding();
          this.close();
        })
        .catch((err) => {
          this.toggleAdding();
          if (err.response) {
            this.setState({
              error: err.response.data.details,
              formError: true,
            });
          }
        });
    }
  };

  render() {
    const { adding, formError, person, error } = this.state;
    return (
      <Modal size="mini" open={this.props.open} onClose={this.close}>
        <Modal.Header>Worker Account Details</Modal.Header>
        <Modal.Content>
          <Form error={formError}>
            <Form.Field
              control={Input}
              placeholder="Person Name"
              value={person.fullName}
              onChange={this.fullNameChangeHandler}
            />
            <Form.Field>
              <Input
                value={person.phoneNumber}
                placeholder="Phone Number"
                onChange={this.phNumChangeHandler}
              />
            </Form.Field>
            <Message error content={error} />
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
            onClick={this.addAccount}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AddAccount;
