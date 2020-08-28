import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class OrderStatusLOV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        {
          key: "NEW",
          text: "New",
          value: "NEW",
        },
        {
          key: "COMPLETE",
          text: "Complete",
          value: "COMPLETE",
        },
        {
          key: "CANCELLED",
          text: "Cancelled",
          value: "CANCELLED",
        },
      ],
    };
  }

  orderStatusChangeListener = (e, { value }) => {
    this.props.changeHandler(value);
  };

  render() {
    const { options } = this.state;
    return (
      <Dropdown
        selection
        clearable
        options={options}
        placeholder="Status"
        onChange={this.orderStatusChangeListener}
      />
    );
  }
}

export default OrderStatusLOV;
