import React, { Component } from "react";
import { Modal, Form, Button, Message, Input } from "semantic-ui-react";
import NumberInput from "semantic-ui-react-numberinput";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";

class UpdateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: false,
      adding: false,
      reload: false,
      table: {
        id: "",
        tableName: "",
        capacity: "0",
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.table.id !== this.props.table.id ||
      this.state !== nextState
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.table.id !== this.props.table.id) {
      this.setState({
        reload: !this.state.reload,
        table: {
          id: this.props.table.id,
          tableName: this.props.table.tableName,
          capacity: this.props.table.capacity,
        },
      });
    }
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
        id: "",
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

  updateTable = () => {
    const { table } = this.state;
    if (table.tableName === null || table.tableName === "") {
      this.setState({
        formError: true,
      });
    } else {
      Axios.post(urls.table, table, { headers: authHeader() })
        .then((response) => {
          if (
            response.data.result !== null &&
            response.data.result.length > 0
          ) {
            this.props.updateTable(response.data.result[0]);
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
        <Modal.Header>Update Table</Modal.Header>
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
            onClick={this.updateTable}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default UpdateTable;
