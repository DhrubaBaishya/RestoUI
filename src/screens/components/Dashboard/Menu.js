import React, { Component } from "react";
import Axios from "axios";
import { urls } from "../../../properties/properties";
import authHeader from "../../../service/authHeader";
import { Table, Button, Divider } from "semantic-ui-react";
import CategoryType from "../Settings/Menu/CategoryType";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      <div>
        <CategoryType typeChangeHandler={this.changeCategoryType} />
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
                        basic
                        size="mini"
                        onClick={() => this.addItem(item)}
                      >
                        Add
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
      </div>
    );
  }
}

export default Menu;
