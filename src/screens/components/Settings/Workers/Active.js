import React, { Component } from "react";
import { Form, Select } from "semantic-ui-react";

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [
        { key: 1, text: "Active", value: "Active" },
        { key: 2, text: "Inactive", value: "Inactive" },
      ],
    };
  }

  valueChangeListener = (e, { value }) => {
    this.props.changeStatus(value);
    this.setState({
      selectedValue: value,
    });
  };

  render() {
    const { values } = this.state;
    const { selectedValue } = this.props;
    return (
      <Form.Field
        options={values}
        control={Select}
        placeholder="Category"
        value={selectedValue}
        onChange={this.valueChangeListener}
        search
      />
    );
  }
}

export default Active;
