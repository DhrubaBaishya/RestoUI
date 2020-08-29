import React, { Component } from "react";
import authHeader from "../../service/authHeader";
import { urls } from "../../properties/properties";
import Axios from "axios";
import Order from "./Dashboard/Order";
import { Segment, Card, Header } from "semantic-ui-react";
import Table from "./Dashboard/Table";
import { validateResponse } from "../../util/Util";
import AreaMenu from "./Common/AreaMenu";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      openOrderMenu: false,
      refreshed: false,
      selectedArea: "",
      areaList: [],
      table: {},
      area: {},
    };
  }

  openOrder = (pArea, pTable) => {
    this.setState({
      area: pArea,
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

  areaChangeHandler = (value) => {
    this.setState({
      selectedArea: value,
    });
  };

  changeTable = (pOrder, pNewTableId) => {
    const { areaList } = this.state;
    for (let i = 0; i < areaList.length; i++) {
      let flag = false;
      for (let j = 0; j < areaList[i].tables.length; j++) {
        if (areaList[i].tables[j].tableId === pNewTableId) {
          this.setState({
            area: areaList[i],
            table: areaList[i].tables[j],
          });
          flag = true;
        }
      }
      if (flag) {
        break;
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.refreshed) {
      Axios.get(urls.area, { headers: authHeader() })
        .then((response) => {
          if (validateResponse(response)) {
            this.setState({
              selectedArea: "",
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
            loading: false,
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
    const { areaList, openOrderMenu, area, table, selectedArea } = this.state;
    let tables = areaList.reduce((prev, area) => {
      return prev + area.tables.length;
    }, 0);
    return (
      <div>
        {!openOrderMenu ? (
          <AreaMenu areaChangeHandler={this.areaChangeHandler} />
        ) : (
          ""
        )}
        {!openOrderMenu ? (
          tables > 0 ? (
            areaList.map((area) =>
              area.areaId === selectedArea || selectedArea === "" ? (
                <Segment>
                  <Header block>{area.areaName}</Header>
                  <Card.Group>
                    {area.tables.map((table) => (
                      <Table
                        key={table.tableId}
                        area={area}
                        table={table}
                        openOrder={this.openOrder}
                      />
                    ))}
                  </Card.Group>
                </Segment>
              ) : (
                ""
              )
            )
          ) : (
            <Segment placeholder>
              {/* <Header icon color="grey">
                <Icon name="setting" />
                There are no tables. Please go to settings are start setting up
                the tables.
              </Header> */}
            </Segment>
          )
        ) : (
          <Order
            area={area}
            table={table}
            closeOrder={this.closeOrder}
            changeTable={this.changeTable}
          />
        )}
      </div>
    );
  }
}

export default Dashboard;
