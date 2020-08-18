import React, { Component } from "react";
import { Menu, Segment } from "semantic-ui-react";
import TableSettings from "./Table/TableSettings";
import MenuSettings from "./Menu/MenuSettings";
import WorkerSettings from "./Workers/WorkerSettings";
import TaxSettings from "./Taxes/TaxSettings";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 1,
    };
  }

  changeMenu = (e, { index }) => {
    this.setState({
      activeItem: index,
    });
  };

  segment() {
    switch (this.state.activeItem) {
      case 1:
        return <TableSettings />;
      case 2:
        return <MenuSettings />;
      case 3:
        return <WorkerSettings />;
      case 4:
        return <TaxSettings />;
      default:
        return <TableSettings />;
    }
  }

  render() {
    const { activeItem } = this.state;
    return (
      <div>
        <Menu attached="top">
          <Menu.Item
            name="Tables"
            index={1}
            active={activeItem === 1}
            onClick={this.changeMenu}
          />
          <Menu.Item
            name="Menu"
            index={2}
            active={activeItem === 2}
            onClick={this.changeMenu}
          />
          <Menu.Item
            name="Accounts"
            index={3}
            active={activeItem === 3}
            onClick={this.changeMenu}
          />
          <Menu.Item
            name="Taxes"
            index={4}
            active={activeItem === 4}
            onClick={this.changeMenu}
          />
        </Menu>

        <Segment attached>{this.segment()}</Segment>
      </div>
    );
  }
}

export default Settings;
