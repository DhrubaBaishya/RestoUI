import React, { Component } from "react";
import { Segment, Table, Divider, Header } from "semantic-ui-react";
import Axios from "axios";
import { generateURL, validateResponse, noResult } from "../../../util/Util";
import { urls, general } from "../../../properties/properties";
import authHeader from "../../../service/authHeader";
import LoadMore from "../Common/LoadMore";
import OrderSearch from "./OrderSearch";
import BillModal from "../Dashboard/BillModal";
import AppButton from "../Common/AppButton";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      loading: false,
      openSearch: false,
      openBill: false,
      order: {},
      search: false,
      orders: [],
      url: "",
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  openBill = (pOrder) => {
    this.setState({
      openBill: true,
      order: pOrder,
    });
  };

  closeBill = () => {
    this.setState({
      openBill: false,
      order: {},
    });
  };

  openSearch = () => {
    this.setState({
      openSearch: true,
    });
  };

  closeSearch = () => {
    this.setState({
      openSearch: false,
    });
  };

  search = (filter) => {
    const { status, dateFilter, date, orderId } = filter;
    let search = "";
    if (status !== null && status !== "") {
      search = search + "status=" + status + ",";
    }
    if (orderId !== null && orderId !== "") {
      search = search + "orderId=" + orderId + ",";
    }
    if (date !== null && date !== "") {
      switch (dateFilter) {
        case "AFTER":
          search = search + "creationDate>" + date + ",";
          break;
        case "BEFORE":
          search = search + "creationDate<" + date + ",";
          break;
        case "EQUALS":
          search = search + "creationDate=" + date + ",";
          break;
        default:
          search = search + "creationDate=" + date + ",";
      }
    }
    console.log(search);
    let url = generateURL(
      urls.order,
      ["size", "search"],
      [general.pageSize, search]
    );
    let pageURL = url + "&page=1";
    console.log(pageURL);
    this.toggleLoading();
    Axios.get(pageURL, { headers: authHeader() })
      .then((response) => {
        this.toggleLoading();
        if (validateResponse(response)) {
          this.setState({
            page: 1,
            orders: response.data.result,
            url: url,
            openSearch: false,
            search: true,
          });
        } else if (noResult(response)) {
          this.setState({
            page: 1,
            orders: [],
            url: url,
            openSearch: false,
            search: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.toggleLoading();
      });
  };

  clearSearch = () => {
    const { page } = this.state;
    let url = generateURL(urls.order, ["size"], [general.pageSize]);
    let pageURL = url + "&page=" + page;
    Axios.get(pageURL, { headers: authHeader() })
      .then((response) => {
        if (validateResponse(response)) {
          this.setState({
            orders: response.data.result,
            url: url,
            search: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  loadMore = () => {
    let { page, orders, url } = this.state;

    let pageURL = url + "&page=" + (page + 1);
    this.toggleLoading();
    Axios.get(pageURL, { headers: authHeader() })
      .then((response) => {
        this.toggleLoading();
        if (validateResponse(response)) {
          orders = orders.concat(response.data.result);
          this.setState({
            page: page + 1,
            orders: orders,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.toggleLoading();
      });
  };

  componentDidMount() {
    const { page } = this.state;
    let url = generateURL(urls.order, ["size"], [general.pageSize]);
    let pageURL = url + "&page=" + page;
    Axios.get(pageURL, { headers: authHeader() })
      .then((response) => {
        if (validateResponse(response)) {
          this.setState({
            orders: response.data.result,
            url: url,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { orders, loading, openSearch, search, openBill, order } = this.state;
    return (
      <div>
        <Segment>
          <Header>Order History</Header>
          <Divider />
          <AppButton
            title="Open Search"
            icon="search"
            onClick={this.openSearch}
          />
          {search ? (
            <AppButton
              title="Clear Search"
              icon="close"
              onClick={this.clearSearch}
            />
          ) : (
            ""
          )}
          <Divider />
          <Table compact selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="left">
                  Order Number
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="left">Status</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  No of items
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  Total Amount
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  Tax Amount
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  Net Amount
                </Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {orders.map((order) => {
                let items = order.items;
                let totalAmount = items.reduce((prev, item) => {
                  return prev + item.quantity * item.price;
                }, 0);

                let netAmount = order.taxes.reduce((prev, tax) => {
                  if (tax.included === "Y")
                    return (
                      prev + Math.round((tax.percentage / 100) * totalAmount)
                    );
                  else return prev;
                }, totalAmount);

                return (
                  <Table.Row
                    key={order.orderId}
                    positive={order.status === "NEW"}
                    negative={order.status === "CANCELLED"}
                    onClick={() => this.openBill(order)}
                  >
                    <Table.Cell textAlign="left">{order.orderId}</Table.Cell>
                    <Table.Cell textAlign="left">{order.status}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {order.items.length}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{totalAmount}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {netAmount - totalAmount}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{netAmount}</Table.Cell>
                    <Table.Cell>{order.properCreationDate}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <LoadMore loading={loading} loadMore={this.loadMore} />
          <OrderSearch
            open={openSearch}
            close={this.closeSearch}
            search={this.search}
          />
        </Segment>
        <BillModal
          open={openBill}
          close={this.closeBill}
          order={order}
          tableName={order.tableName}
        />
      </div>
    );
  }
}

export default Orders;
