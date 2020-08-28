import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class SearchOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        {
          key: "BASIC",
          text: "Basic Search",
          value: "BASIC",
        },
        {
          key: "ADVANCE",
          text: "Advance Search",
          value: "ADVANCE",
        },
      ],
    };
  }

  searchOptionChangeListener = (e, { value }) => {
    this.props.changeHandler(value);
  };

  render() {
    const { options } = this.state;
    return (
      <Dropdown
        selection
        value={this.props.default}
        options={options}
        placeholder="Status"
        onChange={this.searchOptionChangeListener}
      />
    );
  }
}

export default SearchOption;
