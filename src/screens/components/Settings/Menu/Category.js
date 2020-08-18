import React, { Component } from "react";
import { Form, Select } from "semantic-ui-react";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
  }

  componentDidMount(prevProps, nextState) {
    const categories = [];
    Axios.get(urls.category, { headers: authHeader() })
      .then((response) => {
        const { result } = response.data;
        for (let i = 0; i < result.length; i++) {
          let type = {
            key: result[i].id,
            text: result[i].categoryName,
            value: result[i].id,
          };
          categories.push(type);
        }
        this.setState({
          categories: categories,
        });
      })
      .catch((msg) => {
        console.log(msg);
      });
  }

  categoryChangeListener = (e, { value }) => {
    this.props.categoryChangeHandler(value);
  };

  render() {
    const { categories } = this.state;
    const { categoryId } = this.props;
    return (
      <Form.Field
        options={categories}
        control={Select}
        placeholder="Category"
        value={categoryId}
        onChange={this.categoryChangeListener}
        search
      />
    );
  }
}

export default Category;
