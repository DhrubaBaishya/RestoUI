import React, { Component } from "react";
import { Modal, Form, Button, Message, Input } from "semantic-ui-react";
import NumberInput from "semantic-ui-react-numberinput";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";

class AddTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: false,
      adding: false,
      table: {
        capacity: "0",
        tableName: "",
      },
    };
  }

  toggleButtonLoading = () => {
    this.setState({
      adding: !this.state.adding,
    });
  };

  close = () => {
    this.setState({
      formError: false,
      table: {
        capacity: "0",
        tableName: "",
      },
    });
    this.props.close();
  };

  changeCapacity = (newValue) => {
    this.setState({
      ...this.state,
      table: { ...this.state.table, capacity: newValue },
    });
  };

  tableNameChangeHandler = (e) => {
    this.setState({
      ...this.state,
      formError: false,
      table: {
        ...this.state.table,
        tableName: e.target.value,
      },
    });
  };

  addTable = () => {
    const { table } = this.state;
    console.log(table);
    if (table.tableName === null || table.tableName === "") {
      this.setState({
        formError: true,
      });
    } else {
      Axios.post(urls.table, table, { headers: authHeader() })
        .then((response) => {
          for (let i = 0; i < response.data.result.length; i++) {
            this.props.addTableToList(response.data.result[i]);
          }
          this.close();
        })
        .catch((msg) => {
          console.log(msg);
        });
    }
  };

  render() {
    const { table, adding, formError } = this.state;
    return (
      <Modal size="mini" open={this.props.open} onClose={this.close}>
        <Modal.Header>Table Details</Modal.Header>
        <Modal.Content>
          <Form error={formError}>
            <Form.Field
              control={Input}
              placeholder="Table Name"
              value={table.tableName}
              onChange={this.tableNameChangeHandler}
            />
            <Form.Field>
              <label>Table Capacity</label>
              <NumberInput
                value={table.capacity}
                onChange={this.changeCapacity}
              />
            </Form.Field>
            <Message error content={errorMessages.emptyTableName} />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close} disabled={adding}>
            Cancel
          </Button>
          <Button
            positive
            icon="save"
            loading={adding}
            disabled={adding}
            labelPosition="right"
            content="Save"
            onClick={this.addTable}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AddTable;
