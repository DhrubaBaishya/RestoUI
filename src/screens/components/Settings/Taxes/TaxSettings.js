import React, { Component } from "react";
import { Form, Divider, Table, Confirm } from "semantic-ui-react";
import AddTax from "./AddTax";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import UpdateTax from "./UpdateTax";
import AppButton from "../../Common/AppButton";
import UpdateButton from "../../Common/UpdateButton";
import DeleteButton from "../../Common/DeleteButton";

class TaxSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAdd: false,
      openUpdate: false,
      loading: false,
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

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

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
    this.toggleLoading();
    Axios.delete(urls.tax + "/" + tax.taxId, { headers: authHeader() })
      .then((response) => {
        this.toggleLoading();
        this.deleteTax();
      })
      .catch((err) => {
        this.toggleLoading();
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
    const {
      openAdd,
      openUpdate,
      tax,
      taxList,
      openConfirm,
      loading,
    } = this.state;
    return (
      <div>
        <Form>
          <Form.Group inline>
            <Form.Field>
              <AppButton title="Add Tax" icon="add" onClick={this.openAdd} />
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
                  <UpdateButton
                    loading={loading}
                    onClick={() => this.openUpdate(pTax)}
                  />
                  <DeleteButton
                    loading={loading}
                    onClick={() => this.openConfirm(pTax)}
                  />
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
