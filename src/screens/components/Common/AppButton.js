import React, { Component } from "react";
import { Button, Icon } from "semantic-ui-react";

class AppButton extends Component {
  render() {
    const { title, icon, onClick } = this.props;
    return (
      <Button basic size="medium" color="blue" onClick={onClick}>
        {icon ? <Icon name={icon} /> : ""}
        {title}
      </Button>
    );
  }
}

export default AppButton;
