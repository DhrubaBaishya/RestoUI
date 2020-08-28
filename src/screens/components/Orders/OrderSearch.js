import React, { Component } from "react";
import { Form, Button, Modal, Input } from "semantic-ui-react";
import OrderStatusLOV from "../Common/OrderStatusLOV";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import Moment from "moment";
import DateFilter from "../Common/DateFilter";

class OrderSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        status: "",
        dateFilter: "AFTER",
        date: "",
        orderId: "",
      },
    };
  }

  dateFilterChangeListener = (pOption) => {
    this.setState({
      filter: {
        ...this.state.filter,
        dateFilter: pOption,
      },
    });
  };

  dateChangeHandler = (e, data) => {
    if (data.value === null) {
      this.setState({
        filter: {
          ...this.state.filter,
          date: "",
        },
      });
    } else {
      this.setState({
        filter: {
          ...this.state.filter,
          date: Moment(data.value.toLocaleDateString()).format("YYYY-MM-DD"),
        },
      });
    }
  };

  orderStatusChangeListener = (pStatus) => {
    this.setState({
      filter: {
        ...this.state.filter,
        status: pStatus,
      },
    });
  };

  orderNumberChangeHandler = (e) => {
    const re = /^[0-9\b]+$/;

    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({
        filter: {
          ...this.state.filter,
          orderId: e.target.value,
        },
      });
    }
  };

  renderDateFilter = () => {
    switch (this.state.filter.dateFilter) {
      case "AFTER":
        return (
          <SemanticDatepicker
            type="basic"
            placeholder="After"
            onChange={this.dateChangeHandler}
            datePickerOnly={true}
          />
        );
      case "BEFORE":
        return (
          <SemanticDatepicker
            type="basic"
            placeholder="Before"
            onChange={this.dateChangeHandler}
          />
        );
      case "EQUALS":
        return (
          <SemanticDatepicker
            type="basic"
            placeholder="Equals"
            onChange={this.dateChangeHandler}
          />
        );
      case "BETWEEN":
        return (
          <SemanticDatepicker
            type="range"
            placeholder="Between"
            onChange={this.dateChangeHandler}
          />
        );
      default:
        return (
          <SemanticDatepicker
            type="basic"
            placeholder="After"
            onChange={this.dateChangeHandler}
          />
        );
    }
  };

  search = () => {
    this.setState({
      filter: {
        status: "",
        dateFilter: "AFTER",
        date: "",
        orderId: "",
      },
    });
    this.props.search(this.state.filter);
  };

  render() {
    const { filter } = this.state;
    const { open } = this.props;
    return (
      <Modal
        size="tiny"
        open={open}
        closeOnDimmerClick={false}
        closeOnEscape={false}
      >
        <Modal.Header>Search Orders</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Order Status</label>
              <OrderStatusLOV changeHandler={this.orderStatusChangeListener} />
            </Form.Field>
            <Form.Field>
              <label>Order Number</label>
              <Input
                placeholder="Order Number"
                value={filter.orderId}
                onChange={this.orderNumberChangeHandler}
              />
            </Form.Field>
            <Form.Group>
              <Form.Field>
                <label>Date Filter</label>
                <DateFilter
                  changeHandler={this.dateFilterChangeListener}
                  default={filter.dateFilter}
                />
              </Form.Field>
              <Form.Field>
                <label>Select Date</label>
                {this.renderDateFilter()}
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={this.props.close}>
            Cancel
          </Button>
          <Button
            positive
            icon="search"
            content="Search"
            labelPosition="right"
            onClick={this.search}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default OrderSearch;
