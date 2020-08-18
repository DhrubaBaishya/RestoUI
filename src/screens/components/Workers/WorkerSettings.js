import React, { Component } from "react";
import { Button, Icon, Divider, Card, Form } from "semantic-ui-react";
import AddAccount from "./AddAccount";
import Active from "./Active";
import Person from "./Person";
import { generateURL } from "../../../util/Util";
import Axios from "axios";
import authHeader from "../../../service/authHeader";
import { urls, general } from "../../../properties/properties";
import UpdateAccount from "./UpdateAccount";

class WorkerSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAdd: false,
      openUpdate: false,
      status: "Active",
      loading: false,
      page: 1,
      personList: [],
      person: {
        personId: "",
        fullName: "",
        phoneNumber: "",
      },
    };
  }

  openAdd = () => {
    this.setState({
      openAdd: true,
    });
  };

  closeAdd = () => {
    this.setState({
      openAdd: false,
    });
  };

  openUpdate = (pPerson) => {
    this.setState({
      openUpdate: true,
      person: pPerson,
    });
  };

  closeUpdate = () => {
    this.setState({
      openUpdate: false,
    });
  };

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  changeStatus = (pStatus) => {
    this.setState({
      status: pStatus,
      page: 1,
    });
  };

  addPerson = (pPerson) => {
    if (this.state.status === "Active") {
      let personList = [];
      personList.push(pPerson);
      personList = personList.concat(this.state.personList);
      this.setState({
        personList: personList,
      });
    }
  };

  updatePerson = (pPerson) => {
    const personIndex = this.state.personList.findIndex(
      (person) => person.personId === pPerson.personId
    );
    const personList = this.state.personList;
    const person = personList[personIndex];
    person.fullName = pPerson.fullName;
    person.phoneNumber = pPerson.phoneNumber;
    person.user.enabled = pPerson.user.enabled;
    personList[personIndex] = person;
    this.setState({
      personList: personList,
    });
  };

  loadMore = () => {
    this.setState({
      page: this.state.page + 1,
      loading: true,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const { page, status } = this.state;
    let url = generateURL(
      urls.person,
      ["page", "size", "status"],
      [page, general.pageSize, status]
    );
    if (this.state.status !== prevState.status) {
      Axios.get(url, { headers: authHeader() })
        .then((response) => {
          this.setState({
            personList: response.data.result,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (this.state.page !== prevState.page) {
      Axios.get(url, { headers: authHeader() })
        .then((response) => {
          let personList = this.state.personList;
          personList = personList.concat(response.data.result);
          this.setState({
            personList: personList,
            loading: false,
          });
        })
        .catch((err) => {
          console.log(err);
          this.toggleLoading();
        });
    }
  }

  componentDidMount() {
    const { page, status } = this.state;
    let url = generateURL(
      urls.person,
      ["page", "size", "status"],
      [page, general.pageSize, status]
    );
    Axios.get(url, { headers: authHeader() })
      .then((response) => {
        this.setState({
          personList: response.data.result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const {
      openAdd,
      openUpdate,
      personList,
      status,
      loading,
      person,
    } = this.state;
    return (
      <div>
        <Form>
          <Form.Group inline>
            <Form.Field>
              <Button basic size="medium" color="brown" onClick={this.openAdd}>
                <Icon name="add" /> Add Account
              </Button>
            </Form.Field>
            <Form.Field>
              <Active changeStatus={this.changeStatus} selectedValue={status} />
            </Form.Field>
          </Form.Group>
        </Form>
        <Divider />
        <Card.Group>
          {personList.map((person) => (
            <Person
              key={person.personId}
              person={person}
              update={this.updatePerson}
              openUpdate={this.openUpdate}
            />
          ))}
        </Card.Group>
        <Divider />
        <Button
          icon
          labelPosition="right"
          onClick={this.loadMore}
          loading={loading}
        >
          Load More
          <Icon name="right arrow" />
        </Button>
        <AddAccount
          open={openAdd}
          close={this.closeAdd}
          addPerson={this.addPerson}
        />
        <UpdateAccount
          open={openUpdate}
          close={this.closeUpdate}
          person={person}
          update={this.updatePerson}
        />
      </div>
    );
  }
}

export default WorkerSettings;
