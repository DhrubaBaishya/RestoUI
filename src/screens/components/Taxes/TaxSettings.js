import React, { Component } from "react";
import { Form, Button, Icon, Divider, Table, Confirm } from "semantic-ui-react";
import AddTax from "./AddTax";
import Axios from "axios";
import { urls } from "../../../properties/properties";
import authHeader from "../../../service/authHeader";
import UpdateTax from "./UpdateTax";

class TaxSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAdd: false,
      openUpdate: false,
      tax: {
        taxId: "",
        taxName: "",
        percentage: "",
        mandatory: "Y",
      },
      taxList: [],
      openConfirm: false,
    };
  }

  openAdd = () => {
    this.setState({
      openAdd: true,
    });
  };

  closeAdd = () => {
    this.setState({
      openAdd: false,
    });
  };

  openUpdate = (pTax) => {
    this.setState({
      tax: pTax,
      openUpdate: true,
    });
  };

  closeUpdate = () => {
    this.setState({
      openUpdate: false,
    });
  };

  openConfirm = (pTax) => {
    this.setState({
      tax: pTax,
      openConfirm: true,
    });
  };

  handleCancel = () => {
    this.setState({
      openConfirm: false,
    });
  };

  handleConfirm = () => {
    this.delete();
    this.handleCancel();
  };

  delete = () => {
    const { tax } = this.state;
    Axios.delete(urls.tax + "/" + tax.taxId, { headers: authHeader() })
      .then((response) => {
        this.deleteTax();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteTax = () => {
    let { tax, taxList } = this.state;
    taxList = taxList.filter((pTax) => tax.taxId !== pTax.taxId);
    this.setState({
      taxList: taxList,
    });
  };

  addTax = (pTax) => {
    let { taxList } = this.state;
    taxList.push(pTax);
    this.setState({
      taxList: taxList,
    });
  };

  updateTax = (pTax) => {
    let { taxList } = this.state;
    let index = taxList.findIndex((tax) => tax.taxId === pTax.taxId);
    let tax = taxList[index];
    tax.taxName = pTax.taxName;
    tax.percentage = pTax.percentage;
    tax.mandatory = pTax.mandatory;
    taxList[index] = tax;
    this.setState({
      taxList: taxList,
    });
  };

  componentDidMount() {
    Axios.get(urls.tax, { headers: authHeader() })
      .then((response) => {
        this.setState({
          taxList: response.data.result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { openAdd, openUpdate, tax, taxList, openConfirm } = this.state;
    return (
      <div>
        <Form>
          <Form.Group inline>
            <Form.Field>
              <Button basic size="medium" color="brown" onClick={this.openAdd}>
                <Icon name="add" /> Add Tax
              </Button>
            </Form.Field>
          </Form.Group>
        </Form>
        <Divider />
        <Table celled compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Tax</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Percentage</Table.HeaderCell>
              {/* <Table.HeaderCell>Reorder</Table.HeaderCell> */}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {taxList.map((pTax) => (
              <Table.Row>
                <Table.Cell collapsing>
                  <Button
                    icon
                    size="mini"
                    basic
                    color="blue"
                    onClick={() => this.openUpdate(pTax)}
                  >
                    <Icon name="edit" />
                  </Button>
                  <Button
                    icon
                    size="mini"
                    basic
                    color="orange"
                    onClick={() => this.openConfirm(pTax)}
                  >
                    <Icon name="trash alternate" />
                  </Button>
                </Table.Cell>
                <Table.Cell>{pTax.taxName}</Table.Cell>
                <Table.Cell textAlign="left">
                  {pTax.mandatory === "Y" ? "Mandatory" : "Optional"}
                </Table.Cell>
                <Table.Cell textAlign="left">{pTax.percentage} %</Table.Cell>
                {/* <Table.Cell collapsing textAlign="right">
                  <Button icon size="mini" basic color="grey">
                    <Icon name="chevron up" />
                  </Button>
                  <Button icon size="mini" basic color="grey">
                    <Icon name="chevron down" />
                  </Button>
                </Table.Cell> */}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <AddTax open={openAdd} addTax={this.addTax} close={this.closeAdd} />
        <UpdateTax
          open={openUpdate}
          tax={tax}
          close={this.closeUpdate}
          updateTax={this.updateTax}
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

export default TaxSettings;
