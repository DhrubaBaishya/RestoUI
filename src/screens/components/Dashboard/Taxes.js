import React, { Component } from "react";
import { Table, Checkbox } from "semantic-ui-react";

class Taxes extends Component {
  toggleInclude = (pTax) => {
    this.props.toggleInclude(pTax);
  };

  render() {
    const { order } = this.props;

    let totalAmount = order.items.reduce((prev, item) => {
      return prev + item.quantity * item.price;
    }, 0);

    let netAmount = order.taxes.reduce((prev, tax) => {
      if (tax.included === "Y")
        return prev + Math.round((tax.percentage / 100) * totalAmount);
      else return prev;
    }, totalAmount);

    return order.taxes.length <= 0 ? (
      ""
    ) : (
      <Table compact="very" size="small" unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tax</Table.HeaderCell>
            <Table.HeaderCell collapsing></Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Percentage</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {order.taxes.map((tax) => (
            <Table.Row>
              <Table.Cell>{tax.taxName}</Table.Cell>
              <Table.Cell collapsing>
                {tax.mandatory !== "Y" ? (
                  <Checkbox
                    label="Include"
                    checked={tax.included === "Y"}
                    onClick={() => this.toggleInclude(tax)}
                  />
                ) : (
                  ""
                )}
              </Table.Cell>
              <Table.Cell textAlign="center">{tax.percentage} %</Table.Cell>
              <Table.Cell textAlign="right">
                {Math.round((tax.percentage / 100) * totalAmount)} /-
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="3" textAlign="left">
              <strong>Net Amount</strong>
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="right">
              <strong>{netAmount} /-</strong>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

export default Taxes;
