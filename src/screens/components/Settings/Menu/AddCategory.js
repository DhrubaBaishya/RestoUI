import React, { Component } from "react";
import { Modal, Form, Message, Button, Input } from "semantic-ui-react";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import CategoryType from "./CategoryType";

class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: false,
      adding: false,
      error: "",
      category: {
        categoryTypeId: "",
        categoryName: "",
      },
    };
  }

  toggleAdding = () => {
    this.setState({
      adding: !this.state.adding,
    });
  };

  clear = () => {
    this.setState({
      formError: false,
      category: {
        categoryTypeId: "",
        categoryName: "",
      },
    });
  };

  close = () => {
    this.clear();
    this.props.close();
  };

  nameChangeHandler = (e) => {
    this.setState({
      formError: false,
      category: {
        ...this.state.category,
        categoryName: e.target.value,
      },
    });
  };

  typeChangeHandler = (value) => {
    this.setState({
      formError: false,
      category: {
        ...this.state.category,
        categoryTypeId: value,
      },
    });
  };

  addCategory = () => {
    const { category } = this.state;
    if (
      category.categoryName === null ||
      category.categoryName === "" ||
      category.categoryTypeId === null ||
      category.categoryTypeId === ""
    ) {
      this.setState({
        error: errorMessages.fieldEmpty,
        formError: true,
      });
    } else {
      this.toggleAdding();
      this.close();
      Axios.post(urls.category, category, { headers: authHeader() })
        .then((response) => {
          if (
            response.data.result !== null &&
            response.data.result.length > 0
          ) {
            this.props.addCategory(response.data.result[0]);
          }
          this.toggleAdding();
        })
        .catch((msg) => {
          this.toggleAdding();
        });
    }
  };

  render() {
    const { formError, category, adding, error } = this.state;
    return (
      <Modal size="mini" open={this.props.open} onClose={this.close}>
        <Modal.Header>Category Details</Modal.Header>
        <Modal.Content>
          <Form error={formError}>
            <CategoryType typeChangeHandler={this.typeChangeHandler} />
            <Form.Field
              control={Input}
              placeholder="Name"
              value={category.categoryName}
              onChange={this.nameChangeHandler}
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
            onClick={this.addCategory}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AddCategory;
