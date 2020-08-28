import React, { Component } from "react";
import { Form, Message, Input } from "semantic-ui-react";
import NumberInput from "semantic-ui-react-numberinput";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import AreaLOV from "./AreaLOV";
import { validateResponse } from "../../../../util/Util";
import AppModal from "../../Common/AppModal";

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

  toggleLoading = () => {
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
      this.toggleLoading();
      Axios.post(urls.table, table, { headers: authHeader() })
        .then((response) => {
          this.toggleLoading();
          if (validateResponse(response)) {
            this.props.add(response.data.result[0]);
          }
          this.close();
        })
        .catch((msg) => {
          this.toggleLoading();
          console.log(msg);
        });
    }
  };

  render() {
    const { table, adding, formError, errors } = this.state;
    const { open } = this.props;
    return (
      <AppModal
        header="Table Details"
        open={open}
        close={this.close}
        save={this.addTable}
        loading={adding}
      >
        <Form error={formError}>
          <Form.Field
            control={Input}
            placeholder="Table Name"
            value={table.tableName}
            onChange={this.tableNameChangeHandler}
          />
          <Form.Field>
            <AreaLOV areaChangeHandler={this.areaChangeHandler} />
          </Form.Field>
          <Form.Field>
            <label>Table Capacity</label>
            <NumberInput
              value={table.capacity}
              onChange={this.changeCapacity}
            />
          </Form.Field>
          <Message error negative list={errors} />
        </Form>
      </AppModal>
    );
  }
}

export default AddTable;
