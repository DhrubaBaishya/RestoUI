import React, { Component } from "react";
import {
  Button,
  Segment,
  Divider,
  Icon,
  Confirm,
  Table,
} from "semantic-ui-react";
import AddTable from "./AddTable";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import UpdateTable from "./UpdateTable";

class Tables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      openAddTable: false,
      openUpdateTable: false,
      openConfirm: false,
      table: {
        tableId: "",
        tableName: "",
        capacity: "0",
      },
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  showConfirm = (pTable) => {
    this.setState({
      openConfirm: true,
      table: pTable,
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

  openAddTable = () => {
    this.setState({
      ...this.state,
      openAddTable: true,
    });
  };

  openUpdateTable = (pTable) => {
    this.setState({
      ...this.state,
      openUpdateTable: true,
      table: pTable,
    });
  };

  close = () => {
    this.setState({
      ...this.state,
      openAddTable: false,
      openUpdateTable: false,
      table: {
        tableId: "",
        tableName: "",
        capacity: "0",
      },
    });
  };

  deleteTable = () => {
    const { table } = this.state;
    this.toggleLoading();
    Axios.post(urls.table + "/" + table.tableId, this.props.table, {
      headers: authHeader(),
    })
      .then((response) => {
        this.toggleLoading();
        this.props.delete(table);
      })
      .catch((msg) => {
        this.toggleLoading();
        console.log("delete failed");
      });
  };

  render() {
    const {
      openAddTable,
      openUpdateTable,
      table,
      openConfirm,
      loading,
    } = this.state;
    const { areaList } = this.props;
    return (
      <div>
        <Segment attached="bottom">
          <Button basic size="medium" color="brown" onClick={this.openAddTable}>
            <Icon name="add" /> Add Table
          </Button>
          <Divider />

          {areaList.map((area) =>
            area.tables.length > 0 ? (
              <Table compact>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="1"></Table.HeaderCell>
                    <Table.HeaderCell colSpan="1">
                      {area.areaName}
                    </Table.HeaderCell>
                    <Table.HeaderCell colSpan="1">Capacity</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {area.tables.map((table) => (
                    <Table.Row key={area.areaId}>
                      <Table.Cell collapsing>
                        <Button
                          icon
                          size="mini"
                          basic
                          color="blue"
                          loading={loading}
                          onClick={() => this.openUpdateTable(table)}
                        >
                          <Icon name="edit" />
                        </Button>
                        <Button
                          icon
                          size="mini"
                          loading={loading}
                          basic
                          color="orange"
                          onClick={() => this.showConfirm(table)}
                        >
                          <Icon name="trash alternate" />
                        </Button>
                      </Table.Cell>
                      <Table.Cell>{table.tableName}</Table.Cell>
                      <Table.Cell collapsing textAlign="center">
                        <strong>{table.capacity}</strong>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              ""
            )
          )}
        </Segment>

        <AddTable open={openAddTable} add={this.props.add} close={this.close} />

        <UpdateTable
          open={openUpdateTable}
          close={this.close}
          table={table}
          update={this.props.update}
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

export default Tables;
