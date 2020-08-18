import React, { Component } from "react";
import { validateResponse } from "../../../../util/Util";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import { Form, Select } from "semantic-ui-react";

class AreaLOV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaList: [],
    };
  }

  componentDidMount(prevProps, nextState) {
    const areas = [];
    Axios.get(urls.area, { headers: authHeader() })
      .then((response) => {
        if (validateResponse(response)) {
          const { result } = response.data;
          for (let i = 0; i < result.length; i++) {
            let type = {
              key: result[i].areaId,
              text: result[i].areaName,
              value: result[i].areaId,
            };
            areas.push(type);
          }
          this.setState({
            areaList: areas,
          });
        }
      })
      .catch((msg) => {
        console.log(msg);
      });
  }

  areaChangeListener = (e, { value }) => {
    this.props.areaChangeHandler(value);
  };

  render() {
    const { areaList } = this.state;
    const { value } = this.props;
    return (
      <Form.Field
        options={areaList}
        control={Select}
        placeholder="Area"
        value={value}
        onChange={this.areaChangeListener}
        search
      />
    );
  }
}

export default AreaLOV;
