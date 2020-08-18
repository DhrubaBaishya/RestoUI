import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";

class Table extends Component {
  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>Table 1</Card.Header>
          <Card.Meta>5 People</Card.Meta>
          <Card.Description>Ordered 5 items</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Button basic color="green">
              Complete
            </Button>
            <Button basic color="red">
              Cancel Order
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default Table;
