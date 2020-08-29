import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { urls } from "../../../properties/properties";
import { validateResponse } from "../../../util/Util";
import Axios from "axios";
import authHeader from "../../../service/authHeader";

class TablesLOV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tables: [],
    };
  }

  componentDidMount(prevProps, prevState) {
    const tables = [];
    Axios.get(urls.area, { headers: authHeader() })
      .then((response) => {
        if (validateResponse(response)) {
          const { result } = response.data;
          for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].tables.length; j++) {
              if (result[i].tables[j].orders.length === 0) {
                let table = {
                  key: result[i].tables[j].tableId,
                  text:
                    result[i].areaName + " - " + result[i].tables[j].tableName,
                  value: result[i].tables[j].tableId,
                };
                tables.push(table);
              }
            }
          }
          this.setState({
            loading: false,
            tables: tables,
          });
        }
      })
      .catch((msg) => {
        console.log(msg);
      });
  }

  tableChangeListener = (e, { value }) => {
    this.props.changeHandler(value);
  };

  render() {
    const { tables, loading } = this.state;
    const { defaultValue, disabled } = this.props;
    return (
      <Dropdown
        selection
        clearable
        disabled={disabled}
        loading={loading}
        options={tables}
        value={defaultValue}
        placeholder="Tables"
        onChange={this.tableChangeListener}
      />
    );
  }
}

export default TablesLOV;
