import React, { Component } from "react";
import { Card, Icon, Button, Popup } from "semantic-ui-react";
import Axios from "axios";
import { urls } from "../../../../properties/properties";
import authHeader from "../../../../service/authHeader";

class AdminTable extends Component {
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

  increaseCapacity = () => {
    this.toggleLoading();
    Axios.post(urls.increateTableCapacity + "/" + this.props.table.id, null, {
      headers: authHeader(),
    })
      .then((response) => {
        this.toggleLoading();
        this.props.incrementCapacity(this.props.table.id);
      })
      .catch((msg) => {
        this.toggleLoading();
      });
  };

  decreaseCapacity = () => {
    this.toggleLoading();
    Axios.post(urls.decreaseTableCapacity + "/" + this.props.table.id, null, {
      headers: authHeader(),
    })
      .then((response) => {
        this.toggleLoading();
        this.props.decrementCapacity(this.props.table.id);
      })
      .catch((msg) => {
        this.toggleLoading();
      });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.table.id === nextProps.table.id &&
      this.props.table.capacity === nextProps.table.capacity &&
      this.props.table.tableName === nextProps.table.tableName
    ) {
      return false;
    } else {
      return true;
    }
  }

  openConfirm = () => {
    this.props.showConfirm(this.props.table.id);
  };

  openTableUpdate = () => {
    this.props.showUpdate(this.props.table);
  };

  render() {
    const { table } = this.props;
    let loading = this.props.loading || this.state.loading;
    console.log("rendering table " + table.id);
    return (
      <Card>
        <Card.Content>
          <Card.Header textAlign="center">{table.tableName}</Card.Header>
          <Card.Description textAlign="center">
            <Icon name="users" color="grey" /> <strong>{table.capacity}</strong>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui four buttons">
            <Popup
              content="Decrease capacity"
              size="mini"
              position="bottom center"
              trigger={
                <Button
                  basic
                  color="grey"
                  loading={loading}
                  disabled={loading}
                  onClick={this.decreaseCapacity}
                >
                  <Icon name="minus" />
                </Button>
              }
            />
            <Popup
              content="Increase capacity"
              size="mini"
              position="bottom center"
              trigger={
                <Button
                  basic
                  color="grey"
                  loading={loading}
                  disabled={loading}
                  onClick={this.increaseCapacity}
                >
                  <Icon name="add" />
                </Button>
              }
            />
            <Button
              animated="fade"
              basic
              color="grey"
              onClick={this.openTableUpdate}
              loading={loading}
              disabled={loading}
            >
              <Button.Content visible>
                <Icon name="edit" />
              </Button.Content>
              <Button.Content hidden>Update</Button.Content>
            </Button>
            <Button
              animated="fade"
              basic
              color="grey"
              onClick={this.openConfirm}
              loading={loading}
              disabled={loading}
            >
              <Button.Content visible>
                <Icon name="trash alternate" />
              </Button.Content>
              <Button.Content hidden>Delete</Button.Content>
            </Button>
            {/* <Button
              basic
              color="grey"
              onClick={this.openConfirm}
              loading={loading}
              disabled={loading}
            >
              <Icon name="trash alternate" />
            </Button> */}
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default AdminTable;
