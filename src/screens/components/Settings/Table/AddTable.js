import React, { Component } from "react";
import { Modal, Form, Button, Message, Input } from "semantic-ui-react";
import NumberInput from "semantic-ui-react-numberinput";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import AreaLOV from "./AreaLOV";
import { validateResponse } from "../../../../util/Util";

class AddTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: false,
      errors: [],
      adding: false,
      table: {
        capacity: "0",
        areaId: "",
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
        areaId: "",
        tableName: "",
      },
    });
    this.props.close();
  };

  changeCapacity = (newValue) => {
    this.setState({
      table: { ...this.state.table, capacity: newValue },
    });
  };

  tableNameChangeHandler = (e) => {
    this.setState({
      formError: false,
      table: {
        ...this.state.table,
        tableName: e.target.value,
      },
    });
  };

  areaChangeHandler = (value) => {
    this.setState({
      formError: false,
      table: {
        ...this.state.table,
        areaId: value,
      },
    });
  };

  addTable = () => {
    const { table } = this.state;
    let errors = [];
    if (table.tableName === null || table.tableName === "") {
      errors.push(errorMessages.emptyTableName);
    }
    if (table.areaId === null || table.areaId === "") {
      errors.push(errorMessages.areaNotSelected);
    }
    if (errors.length > 0) {
      this.setState({
        formError: true,
        errors: errors,
      });
    } else {
      Axios.post(urls.table, table, { headers: authHeader() })
        .then((response) => {
          if (validateResponse(response)) {
            this.props.add(response.data.result[0]);
          }
          this.close();
        })
        .catch((msg) => {
          console.log(msg);
        });
    }
  };

  render() {
    const { table, adding, formError, errors } = this.state;
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
            <AreaLOV areaChangeHandler={this.areaChangeHandler} />
            <Form.Field>
              <label>Table Capacity</label>
              <NumberInput
                value={table.capacity}
                onChange={this.changeCapacity}
              />
            </Form.Field>
            <Message error negative list={errors} />
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
