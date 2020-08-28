import React, { Component } from "react";
import { Button, Icon } from "semantic-ui-react";

class UpdateButton extends Component {
  render() {
    const { loading, onClick } = this.props;
    return (
      <Button
        icon
        size="mini"
        basic
        color="blue"
        loading={loading}
        disabled={loading}
        onClick={onClick}
      >
        <Icon name="edit" />
      </Button>
    );
  }
}

export default UpdateButton;
