import React, { Component } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import "./styles/globalStyles.css";
import LoginScreen from "./screens/LoginScreen";
import { logout } from "./redux/actions";
import { connect } from "react-redux";
import Home from "./screens/Home";

class App extends Component {
  render() {
    const { user } = this.props;
    // console.log("USER:::");
    // console.log(user);
    return <div>{user ? <Home /> : <LoginScreen />}</div>;
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
