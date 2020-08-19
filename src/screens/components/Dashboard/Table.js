import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import { tableEmpty, tableOccupied } from "./style";

class Table extends Component {
  openOrder = () => {
    this.props.openOrder(this.props.table);
  };

  render() {
    const { table } = this.props;
    let tableStyle = table.orders.length > 0 ? tableOccupied : tableEmpty;
    return (
      <Card raised style={{ maxWidth: "200px" }}>
        <Card.Content style={tableStyle}>
          <Card.Header>{table.tableName}</Card.Header>
          <Card.Meta>
            Can serve <strong>{table.capacity}</strong> people
          </Card.Meta>
          <Card.Description>
            {table.orders.length > 0 ? "Serving" : "Available"}
          </Card.Description>
        </Card.Content>
        <Card.Content extra style={tableStyle}>
          <div className="ui two buttons">
            <Button basic color="violet" onClick={this.openOrder}>
              {table.orders.length > 0 ? "View Order" : "Create Order"}
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default Table;
