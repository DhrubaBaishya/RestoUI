import React, { Component } from "react";
import authHeader from "../../service/authHeader";
import { urls } from "../../properties/properties";
import Axios from "axios";
import Order from "./Dashboard/Order";
import { Segment, Card } from "semantic-ui-react";
import Table from "./Dashboard/Table";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableList: [],
      openOrderMenu: false,
      refreshed: false,
      table: {},
    };
  }

  openOrder = (pTable) => {
    this.setState({
      table: pTable,
      openOrderMenu: true,
    });
  };

  closeOrder = () => {
    this.setState({
      refreshed: false,
      openOrderMenu: false,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    console.log("Updating");
    if (!this.state.refreshed) {
      Axios.get(urls.table, { headers: authHeader() })
        .then((response) => {
          console.log("Refreshed");
          this.setState({
            ...this.state,
            refreshed: true,
            tableList: response.data.result,
          });
        })
        .catch((msg) => {
          console.log(msg);
        });
    }
  }

  componentDidMount(nextProps, nextState) {
    console.log("Mounting");
    Axios.get(urls.table, { headers: authHeader() })
      .then((response) => {
        console.log("Got Data");
        this.setState({
          ...this.state,
          refreshed: true,
          tableList: response.data.result,
        });
      })
      .catch((msg) => {
        console.log(msg);
      });
  }

  render() {
    const { tableList, openOrderMenu, table } = this.state;
    return (
      <div>
        {!openOrderMenu ? (
          <Segment>
            <Card.Group>
              {tableList.map((table) => (
                <Table table={table} openOrder={this.openOrder} />
              ))}
            </Card.Group>
          </Segment>
        ) : (
          <Order table={table} closeOrder={this.closeOrder} />
        )}
      </div>
    );
  }
}

export default Dashboard;
