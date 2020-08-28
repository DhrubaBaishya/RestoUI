import React, { Component } from "react";
import { Form, Input, Message } from "semantic-ui-react";
import Category from "./Category";
import Axios from "axios";
import { urls, errorMessages } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import AppModal from "../../Common/AppModal";

class UpdateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: false,
      loading: false,
      error: "",
      reload: false,
      oldItem: {
        id: "",
        itemName: "",
        price: "",
        categoryId: "",
      },
      item: {
        id: "",
        itemName: "",
        price: "",
        categoryId: "",
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item.id !== this.props.item.id || this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.item.id !== this.props.item.id) {
      const { item } = this.props;
      this.setState({
        reload: !this.state.reload,
        oldItem: {
          id: item.id,
          itemName: item.itemName,
          price: item.price,
          categoryId: item.categoryId,
          categoryTypeId: item.categoryTypeId,
        },
        item: {
          id: item.id,
          itemName: item.itemName,
          price: item.price,
          categoryId: item.categoryId,
          categoryTypeId: item.categoryTypeId,
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
      item: {
        id: "",
        itemName: "",
        price: "",
        categoryId: "",
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
      item: {
        ...this.state.item,
        itemName: e.target.value,
      },
    });
  };

  priceChangeHandler = (e) => {
    const re = /^[0-9\b]+$/;

    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({
        formError: false,
        item: {
          ...this.state.item,
          price: e.target.value,
        },
      });
    }
  };

  categoryChangeHandler = (categoryId) => {
    this.setState({
      formError: false,
      item: {
        ...this.state.item,
        categoryId: categoryId,
      },
    });
  };

  updateItem = () => {
    const { item, oldItem } = this.state;
    if (
      item.itemName === null ||
      item.itemName === "" ||
      item.price === null ||
      item.price === "" ||
      item.categoryId === null ||
      item.categoryId === ""
    ) {
      this.setState({
        error: errorMessages.fieldEmpty,
        formError: true,
      });
    } else {
      this.toggleLoading();
      this.close();
      Axios.post(urls.item, item, { headers: authHeader() })
        .then((response) => {
          if (
            response.data.result !== null &&
            response.data.result.length > 0
          ) {
            this.props.updateItem(response.data.result[0], oldItem);
          }
          this.toggleLoading();
        })
        .catch((msg) => {
          this.toggleLoading();
        });
    }
  };

  render() {
    const { formError, item, loading, error } = this.state;
    const { open } = this.props;
    return (
      <AppModal
        header="Update Item"
        open={open}
        close={this.close}
        save={this.updateItem}
        loading={loading}
      >
        <Form error={formError}>
          <Form.Field
            control={Input}
            placeholder="Name"
            value={item.itemName}
            onChange={this.nameChangeHandler}
          />
          <Form.Field>
            <Input
              value={item.price}
              placeholder="Price"
              onChange={this.priceChangeHandler}
            />
          </Form.Field>
          <Category
            categoryChangeHandler={this.categoryChangeHandler}
            categoryId={item.categoryId}
          />
          <Message error content={error} />
        </Form>
      </AppModal>
    );
  }
}

export default UpdateItem;
