import React, { Component } from "react";
import { Modal, Button, Divider, Table } from "semantic-ui-react";
import CategoryType from "../Settings/Menu/CategoryType";
import Axios from "axios";
import { urls } from "../../../properties/properties";
import authHeader from "../../../service/authHeader";

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      categoryTypes: [],
      categoryTypeId: "",
      selectedCategoryId: "",
    };
  }

  addItem = (pItem) => {
    this.props.addItem(pItem);
  };

  categoryChangeHandler = (pCategoryId) => {};

  changeCategoryType = (pCategoryTypeId) => {
    this.setState({
      categoryTypeId: pCategoryTypeId,
    });
  };

  getQuantity = (pItem) => {
    let { items } = this.state;
    let index = items.findIndex((item) => item.itemName === pItem.itemName);
    if (index >= 0) {
      return items[index].quantity;
    }
    return 0;
  };

  addItem = (pItem) => {
    let { order } = this.props;
    let { items } = this.state;
    let index = items.findIndex((item) => item.itemName === pItem.itemName);
    if (index >= 0) {
      let item = items[index];
      item.quantity = item.quantity + 1;
      item.orderId = order.orderId;
    } else {
      pItem.quantity = 1;
      pItem.orderId = order.orderId;
      items.push(pItem);
    }
    this.setState({
      items: items,
    });
  };

  saveItems = () => {
    this.props.save(this.state.items);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.open !== this.props.open) {
      this.setState({
        items: this.props.order.items,
      });
    }
  }

  componentDidMount() {
    Axios.all([Axios.get(urls.categoryType, { headers: authHeader() })])
      .then(
        Axios.spread((categoryType) => {
          this.setState({
            categoryTypes: categoryType.data.result,
          });
        })
      )
      .catch((msg) => {
        console.log(msg);
      });
  }

  render() {
    const { open } = this.props;
    const { categoryTypes, categoryTypeId } = this.state;
    let categories = [];
    categoryTypes.forEach(
      (type) => (categories = categories.concat(type.categories))
    );
    if (categoryTypeId !== "") {
      const index = categoryTypes.findIndex(
        (type) => type.id === categoryTypeId
      );
      categories = categoryTypes[index].categories;
    }
    return (
      <Modal
        size="large"
        open={open}
        onClose={this.props.close}
        closeOnDimmerClick={false}
        closeOnEscape={false}
      >
        <Modal.Header>Menu</Modal.Header>
        <Modal.Content scrolling>
          <CategoryType
            typeChangeHandler={this.changeCategoryType}
            categoryTypeId={categoryTypeId}
          />
          <Divider />
          {categories.map((category) =>
            category.items.length > 0 ? (
              <Table
                key={category.categoryId}
                compact="very"
                size="small"
                unstackable
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>{category.categoryName}</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {category.items.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.itemName}</Table.Cell>
                      <Table.Cell collapsing textAlign="right">
                        {item.price} /-
                      </Table.Cell>
                      <Table.Cell collapsing textAlign="right">
                        <Button
                          fluid
                          basic
                          size="mini"
                          onClick={() => this.addItem(item)}
                        >
                          {this.getQuantity(item) > 0
                            ? this.getQuantity(item) + " "
                            : "Add"}
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              ""
            )
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={this.props.close}>
            Cancel
          </Button>
          <Button
            positive
            icon="save"
            content="Save"
            labelPosition="right"
            onClick={this.saveItems}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
