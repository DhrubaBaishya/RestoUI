import React, { Component } from "react";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import { Form, Select } from "semantic-ui-react";

class CategoryType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: [],
    };
  }

  componentDidMount(prevProps, prevState) {
    const types = [];
    Axios.get(urls.categoryType, { headers: authHeader() })
      .then((response) => {
        const { result } = response.data;
        for (let i = 0; i < result.length; i++) {
          let type = {
            key: result[i].id,
            text: result[i].typeName,
            value: result[i].id,
          };
          types.push(type);
        }
        this.setState({
          type: types,
        });
      })
      .catch((msg) => {
        console.log(msg);
      });
  }

  categoryTypeChangeListener = (e, { value }) => {
    this.props.typeChangeHandler(value);
  };

  render() {
    const { type } = this.state;
    const { categoryTypeId } = this.props;
    return (
      <Form.Field
        options={type}
        control={Select}
        value={categoryTypeId}
        placeholder="Type"
        onChange={this.categoryTypeChangeListener}
        search
      />
    );
  }
}

export default CategoryType;
