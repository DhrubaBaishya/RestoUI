import React, { Component } from "react";
import { Form, Message, Input } from "semantic-ui-react";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import CategoryType from "./CategoryType";
import AppModal from "../../Common/AppModal";
import { validateResponse } from "../../../../util/Util";

class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: false,
      loading: false,
      error: "",
      category: {
        categoryTypeId: "",
        categoryName: "",
      },
    };
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
      this.toggleLoading();
      this.close();
      Axios.post(urls.category, category, { headers: authHeader() })
        .then((response) => {
          if (validateResponse(response)) {
            this.props.addCategory(response.data.result[0]);
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
        header="Category Details"
        open={open}
        close={this.close}
        save={this.addCategory}
        loading={loading}
      >
        <Form error={formError}>
          <Form.Field>
            <CategoryType typeChangeHandler={this.typeChangeHandler} />
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

export default AddCategory;
