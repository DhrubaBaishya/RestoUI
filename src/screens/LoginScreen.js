import React, { Component } from "react";
import {
  Grid,
  Button,
  Container,
  Image,
  Header,
  Segment,
  Form,
  Message,
  Icon,
} from "semantic-ui-react";
import { errorMessages } from "../properties/properties";
import AuthService from "../service/AuthService";
import img from "../assets/images/image.jfif";
import logo from "../assets/images/canvas.png";
import { login } from "../redux/actions";
import { connect } from "react-redux";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: false,
      loginLoading: false,
      message: ["1st Message", "2nd Message"],
    };
  }

  toggleLoginLoading = () => {
    this.setState({
      loginLoading: !this.state.loginLoading,
    });
  };

  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
      error: false,
      message: [],
    });
  };

  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
      error: false,
      message: [],
    });
  };

  validateForm = () => {
    let errors = [];
    if (this.state.username === null || this.state.username === "") {
      errors.push(errorMessages.emptyUsername);
    }
    if (this.state.password === null || this.state.password === "") {
      errors.push(errorMessages.emptyPassword);
    }
    if (errors.length > 0) {
      this.setState({
        error: true,
        message: errors,
      });
    } else {
      this.toggleLoginLoading();
      AuthService.login(this.state.username, this.state.password)
        .then(() => {
          this.toggleLoginLoading();
          this.props.login();
        })
        .catch((error) => {
          this.setState({
            error: true,
            message: [
              error === undefined
                ? error.response.status === 401
                  ? error.response.data.details
                  : errorMessages.tryAgain
                : errorMessages.checkService,
            ],
          });
          this.toggleLoginLoading();
        });
    }
  };
  render() {
    const { error, message, loginLoading } = this.state;
    return (
      <Grid
        divided="vertically"
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Row columns={3}>
          <Grid.Column width={2}></Grid.Column>
          <Grid.Column width={12}>
            <Container fluid className="LoginContainer">
              <Image src={img} className="loginFormImage" />
              <div className="loginForm">
                <Grid
                  padded
                  textAlign="center"
                  style={{ height: "100%" }}
                  verticalAlign="middle"
                >
                  <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" color="teal" textAlign="center">
                      <Image src={logo} />
                    </Header>
                    <Header as="h2" color="teal" textAlign="center">
                      Login to your account
                    </Header>
                    <Form
                      size="large"
                      error={error}
                      onSubmit={this.validateForm}
                    >
                      <Segment basic>
                        <Form.Input
                          fluid
                          icon="user"
                          iconPosition="left"
                          placeholder="Username"
                          onChange={this.usernameChangeHandler}
                        />
                        <Form.Input
                          fluid
                          icon="lock"
                          iconPosition="left"
                          placeholder="Password"
                          type="password"
                          onChange={this.passwordChangeHandler}
                        />
                        <Button
                          loading={loginLoading}
                          color="teal"
                          disabled={loginLoading}
                          fluid
                          size="large"
                        >
                          Login
                        </Button>
                        <Header as="h5" color="grey" textAlign="center">
                          <Icon name="copyright outline" />
                          2020 Vector Solutions
                        </Header>
                      </Segment>
                      <Segment basic>
                        <Message
                          error
                          negative
                          list={message}
                          style={{ textAlign: "left" }}
                        />
                      </Segment>
                    </Form>
                  </Grid.Column>
                </Grid>
              </div>
            </Container>
          </Grid.Column>
          <Grid.Column width={2}></Grid.Column>
        </Grid.Row>
      </Grid>
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
    login: () => dispatch(login()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
