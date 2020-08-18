import React, { Component } from "react";
import authHeader from "../../service/authHeader";
import { urls } from "../../properties/properties";
import Axios from "axios";
import Order from "./Dashboard/Order";
import { Segment, Card, Header, Icon } from "semantic-ui-react";
import Table from "./Dashboard/Table";
import { validateResponse } from "../../util/Util";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableList: [],
      openOrderMenu: false,
      refreshed: false,
      areaList: [],
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
    if (!this.state.refreshed) {
      Axios.get(urls.area, { headers: authHeader() })
        .then((response) => {
          if (validateResponse(response)) {
            this.setState({
              ...this.state,
              refreshed: true,
              areaList: response.data.result,
            });
          }
        })
        .catch((msg) => {
          console.log(msg);
        });
    }
  }

  componentDidMount(nextProps, nextState) {
    Axios.get(urls.area, { headers: authHeader() })
      .then((response) => {
        if (validateResponse(response)) {
          this.setState({
            ...this.state,
            refreshed: true,
            areaList: response.data.result,
          });
        }
      })
      .catch((msg) => {
        console.log(msg);
      });
  }

  render() {
    const { areaList, openOrderMenu, table } = this.state;
    let tables = areaList.reduce((prev, area) => {
      return prev + area.tables.length;
    }, 0);
    return (
      <div>
        {!openOrderMenu ? (
          tables > 0 ? (
            areaList.map((area) => (
              <Segment key={area.areaId} size="mini" basic>
                <Header block inverted>
                  {area.areaName}
                </Header>
                <Card.Group>
                  {area.tables.map((table) => (
                    <Table
                      key={table.tableId}
                      table={table}
                      openOrder={this.openOrder}
                    />
                  ))}
                </Card.Group>
              </Segment>
            ))
          ) : (
            <Segment placeholder>
              <Header icon color="grey">
                <Icon name="setting" />
                There are no tables. Please go to settings are start setting up
                the tables.
              </Header>
            </Segment>
          )
        ) : (
          <Order table={table} closeOrder={this.closeOrder} />
        )}
      </div>
    );
  }
}

export default Dashboard;
