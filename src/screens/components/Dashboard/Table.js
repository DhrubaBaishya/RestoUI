import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import { tableEmpty, tableOccupied } from "./style";

class Table extends Component {
  openOrder = () => {
    this.props.openOrder(this.props.area, this.props.table);
  };

  render() {
    const { table } = this.props;
    let tableStyle = table.orders.length > 0 ? tableOccupied : tableEmpty;
    let order =
      table.orders.length > 0 ? table.orders[0] : { items: [], taxes: [] };
    let totalAmount = order.items.reduce((prev, item) => {
      return prev + item.quantity * item.price;
    }, 0);

    let netAmount = order.taxes.reduce((prev, tax) => {
      if (tax.included === "Y")
        return prev + Math.round((tax.percentage / 100) * totalAmount);
      else return prev;
    }, totalAmount);
    return (
      <Card style={{ maxWidth: "170px" }} onClick={this.openOrder}>
        <Card.Content style={tableStyle}>
          <Card.Header textAlign="center">{table.tableName}</Card.Header>
          <Card.Meta textAlign="center">
            Can serve <strong>{table.capacity}</strong> people
          </Card.Meta>
          <Card.Description textAlign="center">
            <strong>
              {table.orders.length > 0 ? netAmount + " /-" : "Available"}
            </strong>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default Table;
