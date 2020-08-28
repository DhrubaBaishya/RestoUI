import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import Axios from "axios";
import { urls } from "../../../properties/properties";
import authHeader from "../../../service/authHeader";
import { validateResponse } from "../../../util/Util";

class AreaMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      areaList: [],
    };
  }

  componentDidMount(prevProps, nextState) {
    Axios.get(urls.area, { headers: authHeader() })
      .then((response) => {
        if (validateResponse(response)) {
          const { result } = response.data;
          this.setState({
            loading: false,
            areaList: result,
            activeItem: "",
          });
        }
      })
      .catch((msg) => {
        console.log(msg);
      });
  }

  areaChangeListener = (areaId) => {
    this.setState({
      activeItem: areaId,
    });
    this.props.areaChangeHandler(areaId);
  };

  render() {
    const { areaList, activeItem } = this.state;
    return (
      <Menu widths={areaList.length + 1}>
        <Menu.Item
          name="All"
          active={activeItem === ""}
          onClick={() => this.areaChangeListener("")}
        />
        {areaList.map((area) => (
          <Menu.Item
            name={area.areaName}
            active={activeItem === area.areaId}
            onClick={() => this.areaChangeListener(area.areaId)}
          />
        ))}
      </Menu>
    );
  }
}

export default AreaMenu;
