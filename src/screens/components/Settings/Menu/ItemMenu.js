import React, { Component } from "react";
import { Segment, Divider, Form } from "semantic-ui-react";
import CategoryType from "./CategoryType";
import FoodCategories from "./FoodCategories";
import AddItem from "./AddItem";
import AppButton from "../../Common/AppButton";

class ItemMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryTypeId: "",
      open: false,
    };
  }

  openAddItem = () => {
    this.setState({
      open: true,
    });
  };

  closeAddItem = () => {
    this.setState({
      open: false,
    });
  };

  changeCategoryType = (pCategoryTypeId) => {
    this.setState({
      categoryTypeId: pCategoryTypeId,
    });
  };

  render() {
    const { open, categoryTypeId } = this.state;
    const { updateItem, addItem, deleteItem, categoryTypes } = this.props;
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
        <Segment attached="bottom">
          <Form>
            <Form.Group inline>
              <Form.Field>
                <AppButton
                  title="Add Item"
                  icon="add"
                  onClick={this.openAddItem}
                />
              </Form.Field>
              <Form.Field>
                <CategoryType typeChangeHandler={this.changeCategoryType} />
              </Form.Field>
            </Form.Group>
          </Form>
          <Divider />
          {categories.map((category) =>
            category.items.length > 0 ? (
              <FoodCategories
                key={category.id}
                category={category}
                deleteItem={deleteItem}
                updateItem={updateItem}
              />
            ) : (
              ""
            )
          )}
        </Segment>
        <AddItem open={open} close={this.closeAddItem} addItem={addItem} />
      </div>
    );
  }
}

export default ItemMenu;
