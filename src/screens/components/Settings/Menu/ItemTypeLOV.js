import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class ItemTypeLOV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      type: [
        {
          key: "SINGLE",
          text: "Single Item",
          value: "SINGLE",
        },
        {
          key: "MULTIPLE",
          text: "Variant Item",
          value: "MULTIPLE",
        },
      ],
    };
  }

  typeChangeListener = (e, { value }) => {
    this.props.typeChangeHandler(value);
  };

  render() {
    const { type } = this.state;
    const { defaultValue } = this.props;
    return (
      <Dropdown
        selection
        options={type}
        value={defaultValue}
        placeholder="Type"
        onChange={this.typeChangeListener}
      />
    );
  }
}

export default ItemTypeLOV;
