import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import CategoryMenu from "./CategoryMenu";
import ItemMenu from "./ItemMenu";

class MenuSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 1,
      categoryTypes: [],
    };
  }

  changeMenu = (e, { index }) => {
    this.setState({
      activeItem: index,
    });
  };

  addCategory = (pCategory) => {
    let { categoryTypes } = this.state;
    const typeIndex = categoryTypes.findIndex(
      (type) => type.id === pCategory.categoryTypeId
    );
    let categories = categoryTypes[typeIndex].categories;
    categories.push(pCategory);
    categoryTypes[typeIndex].categories = categories;
    this.setState({
      categoryTypes: categoryTypes,
    });
  };

  deleteCategory = (pCategory) => {
    let types = this.state.categoryTypes;
    const index = types.findIndex(
      (type) => type.id === pCategory.categoryTypeId
    );
    const newCategories = types[index].categories.filter(
      (category) => category.id !== pCategory.id
    );
    types[index].categories = newCategories;
    this.setState({
      categoryTypes: types,
    });
  };

  addItemToType(pItem) {
    let { categoryTypes } = this.state;
    const typeIndex = categoryTypes.findIndex(
      (type) => type.id === pItem.categoryTypeId
    );
    let categories = categoryTypes[typeIndex].categories;
    const categoryIndex = categories.findIndex(
      (category) => category.id === pItem.categoryId
    );
    let items = categories[categoryIndex].items;
    items.push(pItem);
    categories[categoryIndex].items = items;
    categoryTypes[typeIndex].categories = categories;
    return categoryTypes;
  }

  deleteItemFromType(pItem) {
    let { categoryTypes } = this.state;
    const typeIndex = categoryTypes.findIndex(
      (type) => type.id === pItem.categoryTypeId
    );
    let categories = categoryTypes[typeIndex].categories;
    const categoryIndex = categories.findIndex(
      (category) => category.id === pItem.categoryId
    );
    let items = categories[categoryIndex].items;
    const newItems = items.filter((item) => item.id !== pItem.id);
    categories[categoryIndex].items = newItems;
    categoryTypes[typeIndex].categories = categories;
    return categoryTypes;
  }

  addItem = (pItem) => {
    let categoryTypes = this.addItemToType(pItem);
    this.setState({
      categoryTypes: categoryTypes,
    });
  };

  deleteItem = (pItem) => {
    let categoryTypes = this.deleteItemFromType(pItem);
    this.setState({
      categoryTypes: categoryTypes,
    });
  };

  updateItem = (pItem, oldItem) => {
    let { categoryTypes } = this.state;
    let typeIndex = categoryTypes.findIndex(
      (type) => type.id === pItem.categoryTypeId
    );
    let categories = categoryTypes[typeIndex].categories;
    let categoryIndex = categories.findIndex(
      (category) => category.id === pItem.categoryId
    );
    let items = categories[categoryIndex].items;
    let itemIndex = items.findIndex((item) => item.id === pItem.id);
    if (itemIndex === -1) {
      //if category change then add in new category and remove from old category
      items.push(pItem);
      categories[categoryIndex].items = items;
      categoryTypes[typeIndex].categories = categories;
      categoryTypes = this.deleteItemFromType(oldItem);
    } else {
      // else update the item in the same category
      items[itemIndex] = pItem;
      categories[categoryIndex].items = items;
      categoryTypes[typeIndex].categories = categories;
    }
    this.setState({
      categoryTypes: categoryTypes,
    });
  };

  updateCategory = (pCategory, oldCategory) => {
    let { categoryTypes } = this.state;
    if (oldCategory.categoryTypeId !== pCategory.categoryTypeId) {
      let typeIndex = categoryTypes.findIndex(
        (type) => type.id === oldCategory.categoryTypeId
      );
      let categories = categoryTypes[typeIndex].categories;
      let categoryIndex = categories.findIndex(
        (category) => category.id === oldCategory.id
      );
      let category = categories[categoryIndex];
      categories = categories.filter(
        (category) => category.id !== oldCategory.id
      );
      categoryTypes[typeIndex].categories = categories;
      category.categoryName = pCategory.categoryName;
      category.categoryTypeId = pCategory.categoryTypeId;
      typeIndex = categoryTypes.findIndex(
        (type) => type.id === pCategory.categoryTypeId
      );
      let newCategories = categoryTypes[typeIndex].categories;
      newCategories.push(category);
      categoryTypes[typeIndex].categories = newCategories;
      this.setState({
        categoryTypes: categoryTypes,
      });
    } else {
      let typeIndex = categoryTypes.findIndex(
        (type) => type.id === pCategory.categoryTypeId
      );
      let categories = categoryTypes[typeIndex].categories;
      let categoryIndex = categories.findIndex(
        (category) => category.id === pCategory.id
      );
      categories[categoryIndex].categoryName = pCategory.categoryName;
      categoryTypes[typeIndex].categories = categories;
      this.setState({
        categoryTypes: categoryTypes,
      });
    }
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
    const { activeItem, categoryTypes } = this.state;
    return (
      <div>
        <Menu attached="top" size="tiny">
          <Menu.Item
            name="Category"
            index={1}
            active={activeItem === 1}
            onClick={this.changeMenu}
          />
          <Menu.Item
            name="Items"
            index={2}
            active={activeItem === 2}
            onClick={this.changeMenu}
          />
        </Menu>

        {activeItem === 1 ? (
          <CategoryMenu
            categoryTypes={categoryTypes}
            addCategory={this.addCategory}
            updateCategory={this.updateCategory}
            deleteCategory={this.deleteCategory}
          />
        ) : (
          <ItemMenu
            categoryTypes={categoryTypes}
            addItem={this.addItem}
            updateItem={this.updateItem}
            deleteItem={this.deleteItem}
          />
        )}
      </div>
    );
  }
}

export default MenuSettings;
