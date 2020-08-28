import React, { Component } from "react";
import { Table, Confirm } from "semantic-ui-react";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import { urls } from "../../../../properties/properties";
import UpdateCategory from "./UpdateCategory";
import DeleteButton from "../../Common/DeleteButton";
import UpdateButton from "../../Common/UpdateButton";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      openConfirm: false,
      openUpdate: false,
      category: {
        id: "",
        categoryName: "",
        categoryTypeId: "",
        items: [],
      },
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  openUpdate = (pCategory) => {
    this.setState({
      openUpdate: true,
      category: pCategory,
    });
  };

  closeUpdate = () => {
    this.setState({
      openUpdate: false,
      category: {
        id: "",
        categoryName: "",
        categoryTypeId: "",
        items: [],
      },
    });
  };

  showConfirm(category) {
    this.setState({
      openConfirm: true,
      category: category,
    });
  }

  handleCancel = () => {
    this.setState({
      openConfirm: false,
    });
  };

  handleConfirm = () => {
    this.deleteCategory();
    this.handleCancel();
  };

  deleteCategory() {
    this.toggleLoading();
    const { category } = this.state;
    Axios.post(urls.category + "/" + category.id, null, {
      headers: authHeader(),
    })
      .then((response) => {
        this.toggleLoading();
        this.props.deleteCategory(category);
      })
      .catch((msg) => {
        this.toggleLoading();
        console.log(msg);
      });
  }

  render() {
    const { loading, openConfirm, openUpdate, category } = this.state;
    const { type, updateCategory } = this.props;
    const { categories } = type;
    return (
      <div>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="1"></Table.HeaderCell>
              <Table.HeaderCell colSpan="2">{type.typeName}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {categories.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell collapsing>
                  <UpdateButton
                    loading={loading}
                    onClick={() => this.openUpdate(category)}
                  />
                  <DeleteButton
                    loading={loading}
                    onClick={() => this.showConfirm(category)}
                  />
                </Table.Cell>
                <Table.Cell>{category.categoryName}</Table.Cell>
                <Table.Cell collapsing textAlign="right">
                  {category.items.length > 0 ? category.items.length : "No"}{" "}
                  {category.items.length > 1 ? "items" : "item"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <UpdateCategory
          open={openUpdate}
          category={category}
          updateCategory={updateCategory}
          close={this.closeUpdate}
        />
        <Confirm
          open={openConfirm}
          confirmButton="Delete"
          header={
            this.state.category !== undefined &&
            this.state.category.items.length > 0
              ? "Are you sure?"
              : undefined
          }
          content={
            this.state.category !== undefined &&
            this.state.category.items.length > 0
              ? "There are items in this category."
              : "Are you sure?"
          }
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          size="mini"
        />
      </div>
    );
  }
}

export default Categories;
