import React, { Component } from "react";
import { Segment, Button, Divider, Icon } from "semantic-ui-react";
import Categories from "./Categories";
import AddCategory from "./AddCategory";

class CategoryMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  openAddCategory = () => {
    this.setState({
      open: true,
    });
  };

  closeAddCategory = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { open } = this.state;
    const {
      categoryTypes,
      deleteCategory,
      addCategory,
      updateCategory,
    } = this.props;
    return (
      <div>
        <Segment attached="bottom">
          <Button
            basic
            size="medium"
            color="brown"
            onClick={this.openAddCategory}
          >
            <Icon name="add" /> Add Category
          </Button>
          <Divider />
          {categoryTypes.map((type) =>
            type.categories.length > 0 ? (
              <div>
                <Categories
                  type={type}
                  updateCategory={updateCategory}
                  deleteCategory={deleteCategory}
                />
                <Divider />
              </div>
            ) : (
              ""
            )
          )}
        </Segment>
        <AddCategory
          open={open}
          close={this.closeAddCategory}
          addCategory={addCategory}
        />
      </div>
    );
  }
}

export default CategoryMenu;
