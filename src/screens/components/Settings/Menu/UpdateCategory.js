import React, { Component } from "react";
import { Form, Message, Input } from "semantic-ui-react";
import CategoryType from "./CategoryType";
import Axios from "axios";
import { urls, errorMessages } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import AppModal from "../../Common/AppModal";

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

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
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
      this.toggleLoading();
      this.close();
      Axios.post(urls.category, category, { headers: authHeader() })
        .then((response) => {
          if (
            response.data.result !== null &&
            response.data.result.length > 0
          ) {
            this.props.updateCategory(response.data.result[0], oldCategory);
          }
          this.toggleLoading();
        })
        .catch((msg) => {
          this.toggleLoading();
        });
    }
  };

  render() {
    const { formError, category, loading, error } = this.state;
    const { open } = this.props;
    return (
      <AppModal
        header="Update Category"
        open={open}
        close={this.close}
        save={this.updateCategory}
        loading={loading}
      >
        <Form error={formError}>
          <Form.Field>
            <CategoryType
              typeChangeHandler={this.typeChangeHandler}
              categoryTypeId={category.categoryTypeId}
            />
          </Form.Field>
          <Form.Field
            control={Input}
            placeholder="Name"
            value={category.categoryName}
            onChange={this.nameChangeHandler}
          />
          <Message error content={error} />
        </Form>
      </AppModal>
    );
  }
}

export default UpdateCategory;
