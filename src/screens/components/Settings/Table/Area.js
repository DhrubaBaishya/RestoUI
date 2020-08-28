import React, { Component } from "react";
import { Segment, Divider, Table, Confirm } from "semantic-ui-react";
import AddArea from "./AddArea";
import { warnings, urls } from "../../../../properties/properties";
import UpdateArea from "./UpdateArea";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import AppButton from "../../Common/AppButton";
import UpdateButton from "../../Common/UpdateButton";
import DeleteButton from "../../Common/DeleteButton";

class Area extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      openAddArea: false,
      openUpdateArea: false,
      area: {
        areaId: "",
        areaName: "",
        tables: [],
      },
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  openAddArea = () => {
    this.setState({
      openAddArea: true,
    });
  };

  closeAddArea = () => {
    this.setState({
      openAddArea: false,
    });
  };

  openUpdateArea = (pArea) => {
    this.setState({
      openUpdateArea: true,
      area: pArea,
    });
  };

  closeUpdateArea = () => {
    this.setState({
      openUpdateArea: false,
    });
  };

  showConfirm = (pArea) => {
    this.setState({
      openConfirm: true,
      area: pArea,
    });
  };

  handleCancel = () => {
    this.setState({
      openConfirm: false,
    });
  };

  handleConfirm = () => {
    this.deleteArea();
    this.handleCancel();
  };

  deleteArea = () => {
    const { area } = this.state;
    this.toggleLoading();
    Axios.delete(urls.area + "/" + area.areaId, { headers: authHeader() })
      .then((response) => {
        this.toggleLoading();
        this.props.delete(area);
      })
      .catch((err) => {
        this.toggleLoading();
        console.log(err);
      });
  };

  render() {
    const { openAddArea, openUpdateArea, openConfirm, loading } = this.state;
    const { areaList } = this.props;
    return (
      <div>
        <Segment attached="bottom">
          <AppButton title="Add Area" icon="add" onClick={this.openAddArea} />
          <Divider />
          {areaList.length > 0 ? (
            <Table compact>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="1" collapsing></Table.HeaderCell>
                  <Table.HeaderCell colSpan="2">Area</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {areaList.map((area) => (
                  <Table.Row key={area.areaId}>
                    <Table.Cell collapsing>
                      <UpdateButton
                        loading={loading}
                        onClick={() => this.openUpdateArea(area)}
                      />
                      <DeleteButton
                        loading={loading}
                        onClick={() => this.showConfirm(area)}
                      />
                    </Table.Cell>
                    <Table.Cell>{area.areaName}</Table.Cell>
                    <Table.Cell collapsing textAlign="right">
                      {area.tables.length > 0 ? area.tables.length : "No"}{" "}
                      {area.tables.length > 1 ? "tables" : "table"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            ""
          )}
        </Segment>
        <AddArea
          open={openAddArea}
          close={this.closeAddArea}
          add={this.props.add}
        />
        <UpdateArea
          open={openUpdateArea}
          close={this.closeUpdateArea}
          area={this.state.area}
          update={this.props.update}
        />
        <Confirm
          open={openConfirm}
          confirmButton="Delete"
          header={
            this.state.area !== undefined && this.state.area.tables.length > 0
              ? "Are you sure?"
              : undefined
          }
          content={
            this.state.area !== undefined && this.state.area.tables.length > 0
              ? warnings.deleteArea
              : "Are you sure?"
          }
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          size="mini"
        />
      </div>
    );
  }
}

export default Area;
