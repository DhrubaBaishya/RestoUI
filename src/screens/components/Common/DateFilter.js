import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class DateFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        {
          key: "AFTER",
          text: "After",
          value: "AFTER",
        },
        {
          key: "BEFORE",
          text: "Before",
          value: "BEFORE",
        },
        {
          key: "EQUALS",
          text: "Equals",
          value: "EQUALS",
        },
      ],
    };
  }

  dateFilterChangeListener = (e, { value }) => {
    this.props.changeHandler(value);
  };

  render() {
    const { options } = this.state;
    return (
      <Dropdown
        selection
        value={this.props.default}
        options={options}
        placeholder="Date Filter"
        onChange={this.dateFilterChangeListener}
      />
    );
  }
}

export default DateFilter;
