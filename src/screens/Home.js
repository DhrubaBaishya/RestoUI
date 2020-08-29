import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "../redux/actions";
import { Menu, Segment, Image } from "semantic-ui-react";
import logo from "../assets/images/canvas.png";
import Settings from "./components/Settings";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders/Orders";
import AuthService from "../service/AuthService";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 1,
    };
  }

  logout = () => {
    this.props.logout();
  };

  changeMenu = (e, { index }) => {
    this.setState({
      activeItem: index,
    });
  };

  segment() {
    switch (this.state.activeItem) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Orders />;
      case 3:
        return <Dashboard />;
      case 4:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  }

  componentDidMount() {}

  render() {
    const { activeItem } = this.state;
    return (
      <div>
        <Menu pointing className="navBar">
          <Menu.Item className="logoMenuItem" fitted disabled>
            <Image src={logo} style={{ height: 40, width: 40 }} />
          </Menu.Item>
          <Menu.Item
            name="Dashboard"
            index={1}
            active={activeItem === 1}
            onClick={this.changeMenu}
            className="navItem"
          />
          {AuthService.checkOrderAccess() ? (
            <Menu.Item
              name="Orders"
              index={2}
              active={activeItem === 2}
              onClick={this.changeMenu}
              className="navItem"
            />
          ) : (
            ""
          )}
          {AuthService.checkReservationAccess() ? (
            <Menu.Item
              name="Reservations"
              index={3}
              active={activeItem === 3}
              onClick={this.changeMenu}
              className="navItem"
            />
          ) : (
            ""
          )}
          {AuthService.checkSettingsAccess() ? (
            <Menu.Item
              name="Settings"
              index={4}
              active={activeItem === 4}
              onClick={this.changeMenu}
              className="navItem"
            />
          ) : (
            ""
          )}
          <Menu.Item
            name="Logout"
            position="right"
            onClick={this.logout}
            className="navItem"
          />
        </Menu>

        <Segment basic>{this.segment()}</Segment>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
