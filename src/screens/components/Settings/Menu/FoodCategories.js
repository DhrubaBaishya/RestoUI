import React, { Component, Fragment } from "react";
import { Table, Divider, Confirm } from "semantic-ui-react";
import UpdateItem from "./UpdateItem";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import DeleteButton from "../../Common/DeleteButton";
import UpdateButton from "../../Common/UpdateButton";

class FoodCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openConfirm: false,
      loading: false,
      item: {
        id: "",
        itemName: "",
        price: "",
        categoryId: "",
      },
      categories: [],
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  showConfirm = (item) => {
    this.setState({
      openConfirm: true,
      item: item,
    });
  };

  handleCancel = () => {
    this.setState({
      openConfirm: false,
    });
  };

  handleConfirm = () => {
    this.deleteItem();
    this.handleCancel();
  };

  close = () => {
    this.setState({
      open: false,
      item: {
        itemName: "",
        itemType: "SINGLE",
        variants: [],
        price: "",
        categoryId: "",
      },
    });
  };

  deleteItem = () => {
    const { item } = this.state;
    this.toggleLoading();
    Axios.post(urls.item + "/" + item.id, null, { headers: authHeader() })
      .then((response) => {
        this.toggleLoading();
        this.props.deleteItem(item);
      })
      .catch((msg) => {
        this.toggleLoading();
        console.log(msg);
      });
  };

  openUpdate = (pItem) => {
    this.setState({
      open: true,
      item: pItem,
    });
  };

  render() {
    const { item, open, openConfirm, loading } = this.state;
    const { category, updateItem } = this.props;
    //console.log("Rendering::: " + category.id);
    return (
      <div>
        <Table compact="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="1"></Table.HeaderCell>
              <Table.HeaderCell colSpan="2">
                {category.categoryName}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {category.items.map((item) => (
              <Fragment>
                <Table.Row key={item.id}>
                  <Table.Cell collapsing>
                    <UpdateButton
                      loading={loading}
                      onClick={() => this.openUpdate(item)}
                    />
                    <DeleteButton
                      loading={loading}
                      onClick={() => this.showConfirm(item)}
                    />
                  </Table.Cell>
                  <Table.Cell>{item.itemName}</Table.Cell>
                  <Table.Cell collapsing textAlign="right">
                    {item.itemType === "SINGLE" ? item.price + " /-" : ""}
                  </Table.Cell>
                </Table.Row>
                {item.itemType === "MULTIPLE" && item.variants.length > 0
                  ? item.variants.map((variant) => (
                      <Table.Row key={variant.variantId}>
                        <Table.Cell collapsing></Table.Cell>
                        <Table.Cell>
                          <strong>{variant.variantName}</strong>
                        </Table.Cell>
                        <Table.Cell collapsing textAlign="right">
                          {variant.price} /-
                        </Table.Cell>
                      </Table.Row>
                    ))
                  : ""}
              </Fragment>
            ))}
          </Table.Body>
        </Table>
        <Divider />
        <UpdateItem
          item={item}
          open={open}
          close={this.close}
          updateItem={updateItem}
        />
        <Confirm
          open={openConfirm}
          confirmButton="Delete"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          size="mini"
        />
      </div>
    );
  }
}

export default FoodCategories;
