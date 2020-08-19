import React, { Component } from "react";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import { Dropdown } from "semantic-ui-react";

class CategoryType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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
          loading: false,
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
    const { type, loading } = this.state;
    const { categoryTypeId } = this.props;
    return (
      <Dropdown
        selection
        clearable
        loading={loading}
        options={type}
        value={categoryTypeId}
        placeholder="Type"
        onChange={this.categoryTypeChangeListener}
      />
    );
  }
}

export default CategoryType;
