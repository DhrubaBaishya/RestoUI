import React, { Component } from "react";
import { Form, Input, Message } from "semantic-ui-react";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import { errorMessages, urls } from "../../../../properties/properties";
import AppModal from "../../Common/AppModal";

class UpdateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      formError: false,
      error: "",
      person: {
        personId: "",
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
        personId: "",
        fullName: "",
        phoneNumber: "",
      },
    });
  };

  close = () => {
    this.clearForm();
    this.props.close();
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.person.personId !== nextProps.person.personId ||
      this.props.open !== nextProps.open ||
      this.state !== nextState
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.person.personId !== prevProps.person.personId ||
      this.props.open !== prevProps.open
    ) {
      const { person } = this.props;
      this.setState({
        person: {
          personId: person.personId,
          fullName: person.fullName,
          phoneNumber: person.phoneNumber,
        },
      });
    }
  }

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

  updateAccount = () => {
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
          this.toggleLoading();
          if (
            response.data.result !== null &&
            response.data.result.length > 0
          ) {
            this.props.update(response.data.result[0]);
          }
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
        header="Update Account"
        open={open}
        close={this.close}
        save={this.updateAccount}
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

export default UpdateAccount;
