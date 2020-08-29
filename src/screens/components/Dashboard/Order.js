import React, { Component } from "react";
import {
  Segment,
  Header,
  Button,
  Confirm,
  Divider,
  Form,
  Message,
} from "semantic-ui-react";
import MenuModal from "./MenuModal";
import Items from "./Items";
import Axios from "axios";
import { urls, errorMessages } from "../../../properties/properties";
import authHeader from "../../../service/authHeader";
import Taxes from "./Taxes";
import BillModal from "./BillModal";
import ConfirmModal from "../Common/ConfirmModal";
import TablesLOV from "../Common/TablesLOV";
import AppModal from "../Common/AppModal";
import { validateResponse } from "../../../util/Util";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: false,
      errors: [],
      loading: false,
      disabled: true,
      openConfirm: false,
      openCompleteConfirm: false,
      openCancelConfirm: false,
      openChangeTable: false,
      openBill: false,
      openMenu: false,
      saved: true,
      orderCreated: false,
      order: {
        table: this.props.table,
        tableName:
          this.props.area.areaName + " - " + this.props.table.tableName,
        status: "NEW",
        items: [],
        taxes: [],
      },
      tableId: "",
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  openChangeTable = () => {
    this.setState({
      openChangeTable: true,
    });
  };

  closeChangeModal = () => {
    this.setState({
      formError: false,
      openChangeTable: false,
    });
  };

  openMenu = () => {
    this.setState({
      openMenu: true,
    });
  };

  closeMenu = () => {
    this.setState({
      openMenu: false,
    });
  };

  openBill = () => {
    this.setState({
      openBill: true,
    });
  };

  closeBill = () => {
    this.setState({
      openBill: false,
    });
  };

  openConfirm = () => {
    this.setState({
      openConfirm: true,
    });
  };

  closeConfirm = () => {
    this.setState({
      openConfirm: false,
    });
  };

  handleConfirm = () => {
    this.props.closeOrder();
  };

  openCompleteConfirm = () => {
    this.setState({
      openCompleteConfirm: true,
    });
  };

  closeCompleteConfirm = () => {
    this.setState({
      openCompleteConfirm: false,
    });
  };

  handleCompleteConfirm = () => {
    this.completeOrder();
  };

  openCancelConfirm = () => {
    this.setState({
      openCancelConfirm: true,
    });
  };

  closeCancelConfirm = () => {
    this.setState({
      openCancelConfirm: false,
    });
  };

  handleCancelConfirm = () => {
    this.cancelOrder();
  };

  closeOrder = () => {
    if (this.state.saved) {
      this.props.closeOrder();
    } else {
      this.openConfirm();
    }
  };

  tableChangeHandler = (pTableId) => {
    this.setState({
      formError: false,
      tableId: pTableId,
    });
  };

  toggleInclude = (pTax) => {
    let { order } = this.state;
    let taxes = order.taxes;
    let index = taxes.findIndex((tax) => tax.taxId === pTax.taxId);
    let tax = taxes[index];
    tax.included = tax.included === "Y" ? "N" : "Y";
    taxes[index] = tax;
    order.taxes = taxes;
    this.setState({
      saved: false,
      order: order,
    });
  };

  increase = (pItem) => {
    let { order } = this.state;
    let items = order.items;
    let index = items.findIndex((item) => item.itemName === pItem.itemName);
    if (index >= 0) {
      let item = items[index];
      item.quantity = item.quantity + 1;
      item.orderId = order.orderId;
    } else {
      pItem.quantity = 1;
      pItem.orderId = order.orderId;
      items.push(pItem);
    }
    order.items = items;
    this.setState({
      saved: false,
      order: order,
    });
  };

  decrease = (pItem) => {
    let { order } = this.state;
    let items = order.items;
    let index = items.findIndex((item) => item.itemName === pItem.itemName);
    let item = items[index];
    if (item.quantity === 1) {
      items = items.filter((item) => item.itemName !== pItem.itemName);
    } else {
      item.quantity = item.quantity - 1;
      item.orderId = order.orderId;
    }
    order.items = items;
    this.setState({
      saved: false,
      order: order,
    });
  };

  addItem = (pItem) => {
    let { order } = this.state;
    let items = order.items;
    let index = items.findIndex((item) => item.itemName === pItem.itemName);
    if (index >= 0) {
      let item = items[index];
      item.quantity = item.quantity + 1;
      item.orderId = order.orderId;
    } else {
      pItem.quantity = 1;
      pItem.orderId = order.orderId;
      items.push(pItem);
    }
    order.items = items;
    this.setState({
      saved: false,
      order: order,
    });
  };

  saveItems = (pItems) => {
    let { order } = this.state;
    order.items = pItems;
    this.setState({
      saved: false,
      openMenu: false,
      order: order,
    });
  };

  completeOrder = () => {
    const { order } = this.state;
    this.toggleLoading();
    Axios.post(urls.completeOrder, order, { headers: authHeader() })
      .then((response) => {
        this.closeOrder();
        this.toggleLoading();
      })
      .catch((err) => {
        console.log(err);
        this.toggleLoading();
      });
  };

  cancelOrder = () => {
    const { order } = this.state;
    this.toggleLoading();
    Axios.post(urls.cancelOrder, order, { headers: authHeader() })
      .then((response) => {
        this.closeOrder();
        this.toggleLoading();
      })
      .catch((err) => {
        console.log(err);
        this.toggleLoading();
      });
  };

  changeTable = () => {
    const { order, tableId } = this.state;
    this.toggleLoading();
    if (tableId === "") {
      this.setState({
        formError: true,
        loading: false,
        errors: [errorMessages.selectTable],
      });
    } else {
      Axios.post(urls.changeTable + tableId, order, {
        headers: authHeader(),
      })
        .then((response) => {
          if (validateResponse(response)) {
            this.toggleLoading();
            this.props.changeTable(order, tableId);
            this.setState({
              openChangeTable: false,
            });
          }
        })
        .catch((msg) => {
          this.toggleLoading();
          console.log(msg);
        });
    }
  };

  saveOrder = () => {
    const { order } = this.state;
    this.toggleLoading();
    Axios.post(urls.order, order, { headers: authHeader() })
      .then((response) => {
        if (response.data.result != null && response.data.result.length > 0) {
          let orderReturned = response.data.result[0];
          orderReturned.table = order.table;
          this.setState({
            orderCreated: true,
            saved: true,
            order: orderReturned,
            items: orderReturned.items,
          });
        }
        this.toggleLoading();
      })
      .catch((err) => {
        console.log(err);
        this.toggleLoading();
      });
  };

  componentDidMount() {
    const { table } = this.props;
    Axios.all([
      Axios.get(urls.tableOrder + table.tableId, { headers: authHeader() }),
    ])
      .then(
        Axios.spread((pOrder) => {
          if (pOrder.data.result != null && pOrder.data.result.length > 0) {
            let orderReturned = pOrder.data.result[0];
            orderReturned.table = table;
            this.setState({
              disabled: false,
              orderCreated: true,
              order: orderReturned,
            });
          } else {
            this.setState({
              disabled: false,
            });
          }
        })
      )
      .catch((msg) => {
        console.log(msg);
      });
  }

  render() {
    const {
      formError,
      errors,
      order,
      tableId,
      openConfirm,
      openCompleteConfirm,
      openCancelConfirm,
      openChangeTable,
      openBill,
      openMenu,
      saved,
      orderCreated,
      loading,
      disabled,
    } = this.state;
    const { area, table } = this.props;
    return (
      <Segment raised>
        <Header as="h3" block color="white" inverted>
          Order for {area.areaName} - {table.tableName}
        </Header>
        <Items
          items={order.items}
          increase={this.increase}
          decrease={this.decrease}
        />
        <Taxes
          order={order}
          disabled={loading || disabled || !saved}
          toggleInclude={this.toggleInclude}
        />
        <Divider />
        {orderCreated ? (
          <div>
            <Button
              basic
              floated="left"
              icon="payment"
              labelPosition="right"
              color="blue"
              content="Complete"
              loading={loading}
              disabled={!saved || loading || disabled}
              onClick={this.openCompleteConfirm}
            />

            <Button
              basic
              floated="left"
              icon="close"
              labelPosition="right"
              color="blue"
              content="Cancel"
              loading={loading}
              disabled={!saved || loading || disabled}
              onClick={this.openCancelConfirm}
            />

            <Button
              basic
              floated="left"
              icon="file alternate outline"
              labelPosition="right"
              color="blue"
              content="View Bill"
              loading={loading}
              disabled={!saved || loading || disabled}
              onClick={this.openBill}
            />

            <Button
              basic
              floated="left"
              icon="file alternate outline"
              labelPosition="right"
              color="blue"
              content="Change Table"
              loading={loading}
              disabled={!saved || loading || disabled}
              onClick={this.openChangeTable}
            />

            <Button
              positive
              floated="right"
              icon="save"
              labelPosition="right"
              content="Save"
              loading={loading}
              disabled={saved || loading || disabled}
              onClick={this.saveOrder}
            />
          </div>
        ) : (
          <Button
            positive
            floated="right"
            icon="save"
            labelPosition="right"
            content="Create Order"
            loading={loading}
            disabled={order.items.length === 0 || loading || disabled}
            onClick={this.saveOrder}
          />
        )}
        <Button
          floated="right"
          color={saved ? "blue" : "red"}
          onClick={this.closeOrder}
          loading={loading}
          disabled={loading || disabled}
        >
          {saved ? "Close" : "Cancel"}
        </Button>
        <Button
          basic
          floated="left"
          icon="clipboard outline"
          labelPosition="right"
          color="blue"
          content="Open Menu"
          loading={loading}
          disabled={loading || disabled}
          onClick={this.openMenu}
        />
        <br />
        <br />
        <Divider />
        <Confirm
          open={openConfirm}
          header="Are you sure?"
          content="You have not saved changes to the order!"
          confirmButton="Yes"
          onCancel={this.closeConfirm}
          onConfirm={this.handleConfirm}
          size="mini"
        />
        <ConfirmModal
          open={openCompleteConfirm}
          header="Complete Confirmation"
          content="Are you sure you want to complete the order?"
          color="green"
          close={this.closeCompleteConfirm}
          confirm={this.handleCompleteConfirm}
        />
        <ConfirmModal
          open={openCancelConfirm}
          header="Cancel Confirmation"
          content="Are you sure you want to cancel the order?"
          color="red"
          close={this.closeCancelConfirm}
          confirm={this.handleCancelConfirm}
        />

        <BillModal
          open={openBill}
          close={this.closeBill}
          order={order}
          tableName={area.areaName + " - " + table.tableName}
        />

        <AppModal
          open={openChangeTable}
          close={this.closeChangeModal}
          loading={loading}
          header="Change Table"
          save={this.changeTable}
        >
          <Form error={formError}>
            <Form.Field>
              <TablesLOV
                defaultValue={tableId}
                disabled={!saved || loading || disabled}
                changeHandler={this.tableChangeHandler}
              />
            </Form.Field>
            <Message error negative list={errors} />
          </Form>
        </AppModal>

        <MenuModal
          open={openMenu}
          close={this.closeMenu}
          order={order}
          save={this.saveItems}
        />
        <br />
        <br />
      </Segment>
    );
  }
}

export default Order;
