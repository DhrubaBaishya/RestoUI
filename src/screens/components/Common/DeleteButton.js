import React, { Component } from "react";
import { Button, Icon } from "semantic-ui-react";

class DeleteButton extends Component {
  render() {
    const { loading, onClick } = this.props;
    return (
      <Button
        icon
        size="mini"
        basic
        color="red"
        loading={loading}
        disabled={loading}
        onClick={onClick}
      >
        <Icon name="trash alternate" />
      </Button>
    );
  }
}

export default DeleteButton;
