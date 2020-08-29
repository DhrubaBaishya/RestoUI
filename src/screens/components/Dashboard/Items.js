import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";

class Items extends Component {
  render() {
    const { items } = this.props;
    let allTotalAmount = items.reduce((prev, item) => {
      return prev + item.quantity * item.price;
    }, 0);
    let categoryType = items.reduce((pCategoryType, item) => {
      if (!pCategoryType[item.categoryTypeName]) {
        pCategoryType[item.categoryTypeName] = [];
      }
      pCategoryType[item.categoryTypeName].push(item);
      return pCategoryType;
    }, {});

    return (
      <div>
        {items.length > 0 ? (
          Object.entries(categoryType).map(([key, value]) => {
            let totalQuantity = value.reduce((prev, item) => {
              return prev + item.quantity;
            }, 0);
            let totalAmount = value.reduce((prev, item) => {
              return prev + item.quantity * item.price;
            }, 0);

            return (
              <Table compact="very" size="small" unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>{key} Items</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" collapsing>
                      Price
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="center" collapsing>
                      Quantity
                    </Table.HeaderCell>
                    <Table.HeaderCell collapsing>Total</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {items.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan="4">No Items</Table.Cell>
                    </Table.Row>
                  ) : (
                    ""
                  )}
                  {value.map((item) => (
                    <Table.Row>
                      <Table.Cell collapsing>
                        <Button.Group icon size="mini" basic>
                          <Button onClick={() => this.props.decrease(item)}>
                            <Icon name="minus" />
                          </Button>
                          <Button onClick={() => this.props.increase(item)}>
                            <Icon name="add" />
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                      <Table.Cell>{item.itemName}</Table.Cell>
                      <Table.Cell textAlign="center" collapsing>
                        {item.price} /-
                      </Table.Cell>
                      <Table.Cell textAlign="center" collapsing>
                        {item.quantity}
                      </Table.Cell>
                      <Table.Cell collapsing>
                        {item.price * item.quantity} /-
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
                {items.length > 0 ? (
                  <Table.Footer>
                    <Table.Row>
                      <Table.HeaderCell></Table.HeaderCell>
                      <Table.HeaderCell textAlign="center"></Table.HeaderCell>
                      <Table.HeaderCell textAlign="center"></Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        {totalQuantity}
                      </Table.HeaderCell>
                      <Table.HeaderCell collapsing>
                        {totalAmount} /-
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Footer>
                ) : (
                  ""
                )}
              </Table>
            );
          })
        ) : (
          <Table compact="very" size="small" unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>Items</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Price</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Quantity</Table.HeaderCell>
                <Table.HeaderCell collapsing>Total</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell collapsing></Table.Cell>
                <Table.Cell>No Items</Table.Cell>
                <Table.Cell textAlign="center"></Table.Cell>
                <Table.Cell textAlign="center"></Table.Cell>
                <Table.Cell collapsing></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )}
        {allTotalAmount > 0 ? (
          <Table compact="very" size="small" unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="left">
                  Total Amount
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  {allTotalAmount} /-
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Items;
