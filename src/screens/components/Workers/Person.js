import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import Axios from "axios";
import { urls } from "../../../properties/properties";
import authHeader from "../../../service/authHeader";

class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if (this.props.person.personId === 24) {
    //   console.log(nextProps.person.fullName);
    //   console.log(this.props.person.fullName);
    // }
    // if (
    //   this.props.person.fullName !== nextProps.person.fullName ||
    //   this.props.person.phoneNumber !== nextProps.person.phoneNumber ||
    //   this.props.person.user.enabled !== nextProps.person.user.enabled ||
    //   this.state.loading !== nextState.loading
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }
    return true;
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  openUpdate = () => {
    this.props.openUpdate(this.props.person);
  };

  activate = () => {
    let person = this.props.person;
    this.toggleLoading();
    Axios.put(urls.personActivate + person.personId, null, {
      headers: authHeader(),
    })
      .then((response) => {
        person.user.enabled = true;
        this.props.update(person);
        this.toggleLoading();
      })
      .catch((err) => {
        this.toggleLoading();
        console.log(err);
      });
  };

  deactivate = () => {
    let person = this.props.person;
    this.toggleLoading();
    Axios.put(urls.personDeactivate + person.personId, null, {
      headers: authHeader(),
    })
      .then((response) => {
        person.user.enabled = false;
        this.props.update(person);
        this.toggleLoading();
      })
      .catch((err) => {
        this.toggleLoading();
        console.log(err);
      });
  };

  render() {
    const { person } = this.props;
    const { loading } = this.state;
    console.log("PERSON:::   " + person.personId);
    return (
      <Card>
        <Card.Content>
          <Card.Header>{person.fullName}</Card.Header>
          <Card.Meta>{person.phoneNumber}</Card.Meta>
          <Card.Description></Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Button basic color="green" onClick={this.openUpdate}>
              Update
            </Button>

            {person.user.enabled ? (
              <Button
                basic
                color="red"
                onClick={this.deactivate}
                loading={loading}
              >
                Deactivate
              </Button>
            ) : (
              <Button
                basic
                color="blue"
                onClick={this.activate}
                loading={loading}
              >
                Activate
              </Button>
            )}
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default Person;
