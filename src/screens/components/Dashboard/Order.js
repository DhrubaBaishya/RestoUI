import React, { Component } from "react";
import { Segment, Header, Button, Confirm, Divider } from "semantic-ui-react";
import MenuModal from "./MenuModal";
import Items from "./Items";
import Axios from "axios";
import { urls } from "../../../properties/properties";
import authHeader from "../../../service/authHeader";
import PrintModal from "./PrintModal";
import Taxes from "./Taxes";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      disabled: true,
      openConfirm: false,
      openPrint: false,
      openMenu: false,
      saved: true,
      orderCreated: false,
      order: {
        tableId: this.props.table.tableId,
        status: "NEW",
        items: [],
        taxes: [],
      },
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
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

  openPrint = () => {
    this.setState({
      openPrint: true,
    });
  };

  closePrint = () => {
    this.setState({
      openPrint: false,
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

  closeOrder = () => {
    if (this.state.saved) {
      this.props.closeOrder();
    } else {
      this.openConfirm();
    }
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

  saveOrder = () => {
    const { order } = this.state;
    this.toggleLoading();
    Axios.post(urls.order, order, { headers: authHeader() })
      .then((response) => {
        if (response.data.result != null && response.data.result.length > 0) {
          this.setState({
            orderCreated: true,
            saved: true,
            order: response.data.result[0],
            items: response.data.result[0].items,
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
            this.setState({
              disabled: false,
              orderCreated: true,
              order: pOrder.data.result[0],
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
      order,
      openConfirm,
      openPrint,
      openMenu,
      saved,
      orderCreated,
      loading,
      disabled,
    } = this.state;
    const { table } = this.props;
    return (
      <Segment raised>
        {/* <Grid columns={2} stackable>
          <Divider vertical></Divider>

          <Grid.Row verticalAlign="top">
            <Grid.Column>
              <Header as="h3" block color="blue">
                Menu
              </Header>
              <Menu addItem={this.addItem} />
            </Grid.Column>

            <Grid.Column> */}
        <Header as="h3" block color="white" inverted>
          Order for {table.tableName}
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
              onClick={this.completeOrder}
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
              onClick={this.openPrint}
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
          color="blue"
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
        <Confirm
          open={openConfirm}
          header="Are you sure?"
          content="You have not saved changes to the order!"
          confirmButton="Yes"
          onCancel={this.closeConfirm}
          onConfirm={this.handleConfirm}
          size="mini"
        />

        <PrintModal
          open={openPrint}
          close={this.closePrint}
          order={order}
          table={table}
        />

        <MenuModal
          open={openMenu}
          close={this.closeMenu}
          order={order}
          save={this.saveItems}
        />
        <br />
        <br />
        {/* </Grid.Column>
          </Grid.Row>
        </Grid> */}
      </Segment>
    );
  }
}

export default Order;
