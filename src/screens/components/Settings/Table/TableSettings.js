import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { urls } from "../../../../properties/properties";
import axios from "axios";
import authHeader from "../../../../service/authHeader";
import Area from "./Area";
import Tables from "./Tables";

class TableSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 1,
      areaList: [],
      table: {
        id: "",
        tableName: "",
        capacity: "0",
      },
    };
  }

  changeMenu = (e, { index }) => {
    this.setState({
      activeItem: index,
    });
  };

  addAreaToList = (pArea) => {
    let { areaList } = this.state;
    areaList.push(pArea);
    this.setState({
      areaList: areaList,
    });
  };

  deleteArea = (pArea) => {
    const areaList = this.state.areaList.filter(
      (area) => area.areaId !== pArea.areaId
    );
    this.setState({
      areaList: areaList,
    });
  };

  updateArea = (pArea) => {
    let { areaList } = this.state;
    let index = areaList.findIndex((area) => area.areaId === pArea.areaId);
    let area = areaList[index];
    area.areaName = pArea.areaName;
    this.setState({
      areaList: areaList,
    });
  };

  addTable = (pTable) => {
    let { areaList } = this.state;
    let index = areaList.findIndex((area) => area.areaId === pTable.areaId);
    areaList[index].tables.push(pTable);
    this.setState({
      areaList: areaList,
    });
  };

  updateTable = (pOldTable, pTable) => {
    let { areaList } = this.state;
    if (pOldTable.areaId === pTable.areaId) {
      let areaIndex = areaList.findIndex(
        (area) => area.areaId === pTable.areaId
      );
      let tables = areaList[areaIndex].tables;
      let tableIndex = tables.findIndex(
        (table) => table.tableId === pTable.tableId
      );
      tables[tableIndex].tableName = pTable.tableName;
      tables[tableIndex].capacity = pTable.capacity;
      this.setState({
        areaList: areaList,
      });
    } else {
      let index = areaList.findIndex((area) => area.areaId === pTable.areaId);
      areaList[index].tables.push(pTable);
      index = areaList.findIndex((area) => area.areaId === pOldTable.areaId);
      let tables = areaList[index].tables.filter(
        (table) => table.tableId !== pOldTable.tableId
      );
      areaList[index].tables = tables;
      this.setState({
        areaList: areaList,
      });
    }
  };

  deleteTable = (pTable) => {
    let { areaList } = this.state;
    let index = areaList.findIndex((area) => area.areaId === pTable.areaId);
    let tables = areaList[index].tables.filter(
      (table) => table.tableId !== pTable.tableId
    );
    areaList[index].tables = tables;
    this.setState({
      areaList: areaList,
    });
  };

  incrementCapacity = (id) => {
    const index = this.state.tableList.findIndex((table) => table.id === id);
    let tables = this.state.tableList;
    tables[index] = { ...tables[index], capacity: tables[index].capacity + 1 };
    this.setState({
      tableList: tables,
    });
  };

  decrementCapacity = (id) => {
    const index = this.state.tableList.findIndex((table) => table.id === id);
    let tables = this.state.tableList;
    if (tables[index].capacity > 0) {
      tables[index] = {
        ...tables[index],
        capacity: tables[index].capacity - 1,
      };
      this.setState({
        tableList: tables,
      });
    }
  };

  componentDidMount() {
    axios
      .get(urls.area, { headers: authHeader() })
      .then((response) => {
        this.setState({
          ...this.state,
          areaList: response.data.result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { areaList, activeItem } = this.state;
    return (
      <div>
        <Menu attached="top" size="tiny">
          <Menu.Item
            name="Area"
            index={1}
            active={activeItem === 1}
            onClick={this.changeMenu}
          />
          <Menu.Item
            name="Tables"
            index={2}
            active={activeItem === 2}
            onClick={this.changeMenu}
          />
        </Menu>

        {activeItem === 1 ? (
          <Area
            areaList={areaList}
            add={this.addAreaToList}
            update={this.updateArea}
            delete={this.deleteArea}
          />
        ) : (
          <Tables
            areaList={areaList}
            add={this.addTable}
            update={this.updateTable}
            delete={this.deleteTable}
          />
        )}
      </div>
    );
  }
}

export default TableSettings;
