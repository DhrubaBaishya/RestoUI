import React, { Component } from "react";
import { Modal, Form, Button, Message, Input } from "semantic-ui-react";
import { errorMessages, urls } from "../../../../properties/properties";
import Category from "./Category";
import authHeader from "../../../../service/authHeader";
import Axios from "axios";

class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: false,
      adding: false,
      error: "",
      item: {
        itemName: "",
        price: "",
        categoryId: "",
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
      item: {
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

  addItem = () => {
    const { item } = this.state;
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
      this.toggleAdding();
      this.close();
      Axios.post(urls.item, item, { headers: authHeader() })
        .then((response) => {
          if (
            response.data.result !== null &&
            response.data.result.length > 0
          ) {
            this.props.addItem(response.data.result[0]);
          }
          this.toggleAdding();
        })
        .catch((msg) => {
          this.toggleAdding();
        });
    }
  };

  render() {
    const { formError, item, adding, error } = this.state;
    return (
      <Modal size="mini" open={this.props.open} onClose={this.close}>
        <Modal.Header>Item Details</Modal.Header>
        <Modal.Content>
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
            onClick={this.addItem}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AddItem;
