import React, { Component } from "react";
import { businessDetails } from "../../properties/properties";

class PrintOrder extends Component {
  render() {
    const { order, table } = this.props;
    let items = order.items;
    let totalAmount = items.reduce((prev, item) => {
      return prev + item.quantity * item.price;
    }, 0);

    let netAmount = order.taxes.reduce((prev, tax) => {
      if (tax.included === "Y")
        return prev + Math.round((tax.percentage / 100) * totalAmount);
      else return prev;
    }, totalAmount);

    let categoryType = items.reduce((pCategoryType, item) => {
      if (!pCategoryType[item.categoryTypeName]) {
        pCategoryType[item.categoryTypeName] = [];
      }
      pCategoryType[item.categoryTypeName].push(item);
      return pCategoryType;
    }, {});
    return (
      <div style={{ maxWidth: "400px", color: "blue" }}>
        <div style={{ textAlign: "center" }}>
          <h3>{businessDetails.name}</h3>
          <p style={{ margin: 0 }}>{businessDetails.address}</p>
          <p style={{ margin: 0 }}>{businessDetails.city}</p>
          <p style={{ margin: 0 }}>Ph: {businessDetails.phoneNumber}</p>
        </div>
        <hr />
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ textAlign: "left" }}>Bill No: {order.orderId}</td>
              <td style={{ textAlign: "center" }}>Table: {table.tableName}</td>
              <td style={{ textAlign: "right" }}>{order.properCreationDate}</td>
            </tr>
          </tbody>
        </table>
        <hr />
        {Object.entries(categoryType).map(([key, value]) => {
          return (
            <div>
              <table style={{ width: "100%" }}>
                <thead>
                  <th style={{ width: "65%", textAlign: "left" }}>
                    {key} items
                  </th>
                  <th style={{ textAlign: "center" }}>Price</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "left" }}>Price</th>
                </thead>
                <tbody>
                  {value.map((item) => (
                    <tr>
                      <td style={{ width: "65%", textAlign: "left" }}>
                        {item.itemName}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.price}</td>
                      <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ textAlign: "left" }}>
                        {item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
        <hr />
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ textAlign: "left" }}>Total Amount</td>
              <td style={{ textAlign: "right" }}>{totalAmount} /-</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <table style={{ width: "100%" }}>
          <thead>
            <th>Tax</th>
            <th>Percentage</th>
            <th style={{ textAlign: "right" }}>Amount</th>
          </thead>
          <tbody>
            {order.taxes.map((tax) =>
              tax.included === "Y" ? (
                <tr>
                  <td>{tax.taxName}</td>
                  <td>{tax.percentage} %</td>
                  <td style={{ textAlign: "right" }}>
                    {Math.round((tax.percentage / 100) * totalAmount)} /-
                  </td>
                </tr>
              ) : (
                ""
              )
            )}
          </tbody>
        </table>
        <hr />
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ textAlign: "left" }}>Net Amount</td>
              <td style={{ textAlign: "right" }}>{netAmount} /-</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div style={{ textAlign: "center" }}>
          <h3>Thank You Visit Again!</h3>
        </div>
      </div>
    );
  }
}

export default PrintOrder;
