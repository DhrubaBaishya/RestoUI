import React, { Component } from "react";
import { Form, Message, Input } from "semantic-ui-react";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import AppModal from "../../Common/AppModal";

class AddAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      formError: false,
      error: "",
      person: {
        fullName: "",
        phoneNumber: "",
      },
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
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
      this.toggleLoading();
      Axios.post(urls.person, person, { headers: authHeader() })
        .then((response) => {
          this.props.addPerson(response.data.result[0]);
          this.toggleLoading();
          this.close();
        })
        .catch((err) => {
          this.toggleLoading();
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
    const { loading, formError, person, error } = this.state;
    const { open } = this.props;
    return (
      <AppModal
        header="Account Details"
        open={open}
        close={this.close}
        save={this.addAccount}
        loading={loading}
      >
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
      </AppModal>
    );
  }
}

export default AddAccount;
