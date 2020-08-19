import React, { Component } from "react";
import { validateResponse } from "../../../../util/Util";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";
import { Dropdown } from "semantic-ui-react";

class AreaLOV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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
            loading: false,
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
    const { areaList, loading } = this.state;
    const { value } = this.props;
    return (
      <Dropdown
        options={areaList}
        placeholder="Area"
        selection
        loading={loading}
        value={value}
        onChange={this.areaChangeListener}
        clearable
      />
    );
  }
}

export default AreaLOV;
