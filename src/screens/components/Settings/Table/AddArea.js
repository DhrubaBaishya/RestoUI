import React, { Component } from "react";
import { Form, Input, Message } from "semantic-ui-react";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import AppModal from "../../Common/AppModal";

class AddArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      formError: false,
      errorMessage: "",
      area: {
        areaName: "",
      },
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  close = () => {
    this.setState({
      formError: false,
      area: {
        areaName: "",
      },
    });
    this.props.close();
  };

  areaNameChangeHandler = (e) => {
    this.setState({
      area: {
        areaName: e.target.value,
      },
    });
  };

  addArea = () => {
    const { area } = this.state;
    if (area.areaName === "" || area.areaName === null) {
      this.setState({
        formError: true,
        errorMessage: errorMessages.emptyAreaName,
      });
    } else {
      this.toggleLoading();
      Axios.post(urls.area, area, { headers: authHeader() })
        .then((response) => {
          this.toggleLoading();
          if (
            response.data !== null &&
            response.data.result !== null &&
            response.data.result.length > 0
          ) {
            this.props.add(response.data.result[0]);
          }
          this.close();
        })
        .catch((err) => {
          this.toggleLoading();
          console.log(err);
          this.toggleAdding();
          this.setState({
            formError: true,
            errorMessage: errorMessages.tryAgain,
          });
        });
    }
  };

  render() {
    const { area, formError, loading, errorMessage } = this.state;
    const { open } = this.props;
    return (
      <AppModal
        header="Area Details"
        open={open}
        close={this.close}
        save={this.addArea}
        loading={loading}
      >
        <Form error={formError}>
          <Form.Field
            control={Input}
            placeholder="Area Name"
            value={area.areaName}
            onChange={this.areaNameChangeHandler}
          />
          <Message error content={errorMessage} />
        </Form>
      </AppModal>
    );
  }
}

export default AddArea;
