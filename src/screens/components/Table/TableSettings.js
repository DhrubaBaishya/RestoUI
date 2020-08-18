import React, { Component } from "react";
import { Button, Divider, Icon, Card, Confirm } from "semantic-ui-react";
import AdminTable from "./AdminTable";
import { urls } from "../../../properties/properties";
import axios from "axios";
import authHeader from "../../../service/authHeader";
import AddTable from "./AddTable";
import UpdateTable from "./UpdateTable";

class TableSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAdd: false,
      openUpdate: false,
      openConfirm: false,
      loading: false,
      formError: false,
      tableList: [],
      table: {
        id: "",
        tableName: "",
        capacity: "0",
      },
    };
  }

  openAdd = () => {
    this.setState({
      ...this.state,
      openAdd: true,
    });
  };

  openUpdate = () => {
    this.setState({
      ...this.state,
      openUpdate: true,
    });
  };

  close = () => {
    this.setState({
      ...this.state,
      openAdd: false,
      openUpdate: false,
      table: {
        id: "",
        tableName: "",
        capacity: "0",
      },
    });
  };

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  showConfirm = (id) => {
    this.setState({
      openConfirm: true,
      tableId: id,
    });
  };

  showUpdate = (table) => {
    this.setState({
      openUpdate: true,
      table: {
        id: table.id,
        tableName: table.tableName,
        capacity: table.capacity + "",
      },
    });
  };

  handleCancel = () => {
    this.setState({
      openConfirm: false,
    });
  };

  handleConfirm = () => {
    this.deleteTable();
    this.handleCancel();
  };

  deleteTable = () => {
    const { tableId } = this.state;
    this.toggleLoading();
    axios
      .post(urls.table + "/" + tableId, this.props.table, {
        headers: authHeader(),
      })
      .then((response) => {
        this.toggleLoading();
        this.removeTable(tableId);
      })
      .catch((msg) => {
        this.toggleLoading();
        console.log("delete failed");
      });
  };

  removeTable = (tableId) => {
    const tables = this.state.tableList.filter((table) => table.id !== tableId);
    this.setState({
      tableList: tables,
    });
  };

  addTableToList = (table) => {
    this.state.tableList.push(table);
    this.setState({
      ...this.state,
    });
  };

  updateTable = (pTable) => {
    const index = this.state.tableList.findIndex(
      (table) => table.id === pTable.id
    );
    let tables = this.state.tableList;
    tables[index] = {
      ...tables[index],
      capacity: pTable.capacity,
      tableName: pTable.tableName,
    };
    this.setState({
      tableList: tables,
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

  componentDidMount(nextProps, nextState) {
    axios
      .get(urls.table, { headers: authHeader() })
      .then((response) => {
        this.setState({
          ...this.state,
          tableList: response.data.result,
        });
      })
      .catch((msg) => {
        console.log(msg);
      });
  }

  render() {
    const {
      openConfirm,
      loading,
      tableList,
      table,
      openAdd,
      openUpdate,
    } = this.state;
    return (
      <div>
        <Button basic size="medium" color="brown" onClick={this.openAdd}>
          <Icon name="add" /> Add Table
        </Button>
        <Divider />

        <Card.Group>
          {tableList.map((table) => (
            <AdminTable
              key={table.id}
              table={table}
              showConfirm={this.showConfirm}
              loading={loading}
              incrementCapacity={this.incrementCapacity}
              decrementCapacity={this.decrementCapacity}
              showUpdate={this.showUpdate}
            />
          ))}
        </Card.Group>

        <AddTable
          open={openAdd}
          addTableToList={this.addTableToList}
          close={this.close}
        />

        <UpdateTable
          open={openUpdate}
          close={this.close}
          table={table}
          updateTable={this.updateTable}
        />

        <Confirm
          open={openConfirm}
          confirmButton="Delete"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          size="mini"
        />
      </div>
    );
  }
}

export default TableSettings;
