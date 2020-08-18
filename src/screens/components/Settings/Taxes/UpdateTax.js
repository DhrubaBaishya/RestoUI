import React, { Component } from "react";
import { Modal, Form, Input, Button, Message, Select } from "semantic-ui-react";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";

class UpdateTax extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      formError: false,
      error: "",
      tax: {
        taxId: "",
        taxName: "",
        percentage: "",
        mandatory: "Y",
      },
      values: [
        { key: 1, text: "Mandatory", value: "Y" },
        { key: 2, text: "Optional", value: "N" },
      ],
      selectedValue: "Y",
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
      tax: {
        taxId: "",
        taxName: "",
        percentage: "",
        mandatory: "Y",
      },
    });
  };

  close = () => {
    this.clearForm();
    this.props.close();
  };

  nameChangeHandler = (e) => {
    this.setState({
      formError: false,
      tax: {
        ...this.state.tax,
        taxName: e.target.value,
      },
    });
  };

  percentageChangeHandler = (e) => {
    const re = /^[0-9.\b]+$/;

    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({
        formError: false,
        tax: {
          ...this.state.tax,
          percentage: e.target.value,
        },
      });
    }
  };

  valueChangeListener = (e, { value }) => {
    this.setState({
      selectedValue: value,
      tax: {
        ...this.state.tax,
        mandatory: value,
      },
    });
  };

  updateTax = () => {
    const { tax } = this.state;
    const re = /^[0-9]+\.?[0-9]*$/;
    if (
      tax.taxName === "" ||
      tax.taxName === null ||
      tax.percentage === "" ||
      tax.percentage === null
    ) {
      this.setState({
        error: errorMessages.fieldEmpty,
        formError: true,
      });
    } else if (!re.test(tax.percentage)) {
      this.setState({
        error: tax.percentage + errorMessages.invalidValue,
        formError: true,
      });
    } else {
      this.toggleAdding();
      Axios.post(urls.tax, tax, { headers: authHeader() })
        .then((response) => {
          this.toggleAdding();
          this.close();
          this.props.updateTax(response.data.result[0]);
        })
        .catch((err) => {
          this.toggleAdding();
          this.setState({
            error: errorMessages.tryAgain,
            formError: true,
          });
        });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.tax.taxId !== nextProps.tax.taxId ||
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
      this.props.tax.taxId !== prevProps.tax.taxId ||
      this.props.open !== prevProps.open
    ) {
      const { tax } = this.props;
      this.setState({
        tax: {
          taxId: tax.taxId,
          taxName: tax.taxName,
          percentage: tax.percentage,
          mandatory: tax.mandatory,
        },
        selectedValue: tax.mandatory,
      });
    }
  }

  render() {
    const { adding, formError, error, tax, values, selectedValue } = this.state;
    return (
      <Modal size="mini" open={this.props.open} onClose={this.close}>
        <Modal.Header>Update Tax</Modal.Header>
        <Modal.Content>
          <Form error={formError}>
            <Form.Field
              control={Input}
              placeholder="Name"
              value={tax.taxName}
              onChange={this.nameChangeHandler}
            />
            <Form.Field>
              <Input
                value={tax.percentage}
                placeholder="Percentage"
                onChange={this.percentageChangeHandler}
              />
            </Form.Field>
            <Form.Field
              options={values}
              control={Select}
              placeholder="Type"
              value={selectedValue}
              onChange={this.valueChangeListener}
              search
            />
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
            onClick={this.updateTax}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default UpdateTax;
