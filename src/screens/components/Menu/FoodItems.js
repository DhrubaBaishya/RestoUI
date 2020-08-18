import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";
import Axios from "axios";
import authHeader from "../../../service/authHeader";
import { urls } from "../../../properties/properties";

class FoodItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  deleteItem(item) {
    this.toggleLoading();
    Axios.post(urls.item + "/" + item.id, null, { headers: authHeader() })
      .then((response) => {
        this.toggleLoading();
        this.props.deleteItem(item);
      })
      .catch((msg) => {
        this.toggleLoading();
        console.log(msg);
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.item !== nextProps.item) {
      return true;
    }
    return false;
  }

  openUpdate = () => {
    this.props.openUpdate(this.props.item);
  };

  render() {
    const { loading } = this.state;
    const { item } = this.props;
    return (
      <Table.Row key={item.id}>
        <Table.Cell collapsing>
          <Button
            icon
            size="mini"
            basic
            color="blue"
            loading={loading}
            onClick={this.openUpdate}
          >
            <Icon name="edit" />
          </Button>
          <Button
            icon
            size="mini"
            loading={loading}
            basic
            color="orange"
            onClick={() => this.deleteItem(item)}
          >
            <Icon name="trash alternate" />
          </Button>
        </Table.Cell>
        <Table.Cell>{item.itemName}</Table.Cell>
        <Table.Cell collapsing textAlign="right">
          {item.price} /-
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default FoodItems;
