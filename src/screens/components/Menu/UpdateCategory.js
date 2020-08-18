import React, { Component } from "react";
import { Modal, Form, Button, Message, Input } from "semantic-ui-react";
import CategoryType from "./CategoryType";
import Axios from "axios";
import { urls, errorMessages } from "../../../properties/properties";
import authHeader from "../../../service/authHeader";

class UpdateCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      formError: false,
      error: "",
      oldCategory: {
        id: "",
        categoryName: "",
        categoryTypeId: "",
      },
      category: {
        id: "",
        categoryName: "",
        categoryTypeId: "",
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.category.id !== this.props.category.id ||
      this.state !== nextState
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.category.id !== this.props.category.id) {
      const { category } = this.props;
      this.setState({
        reload: !this.state.reload,
        oldCategory: {
          id: category.id,
          categoryName: category.categoryName,
          categoryTypeId: category.categoryTypeId,
        },
        category: {
          id: category.id,
          categoryName: category.categoryName,
          categoryTypeId: category.categoryTypeId,
        },
      });
    }
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
        id: "",
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

  updateCategory = () => {
    const { category, oldCategory } = this.state;
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
            this.props.updateCategory(response.data.result[0], oldCategory);
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
        <Modal.Header>Update Category</Modal.Header>
        <Modal.Content>
          <Form error={formError}>
            <CategoryType
              typeChangeHandler={this.typeChangeHandler}
              categoryTypeId={category.categoryTypeId}
            />
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
            onClick={this.updateCategory}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default UpdateCategory;
