import React, { Component } from "react";
import { Form, Input, Message } from "semantic-ui-react";
import { errorMessages, urls } from "../../../../properties/properties";
import Axios from "axios";
import authHeader from "../../../../service/authHeader";
import AppModal from "../../Common/AppModal";

class UpdateArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      formError: false,
      errorMessage: "",
      area: {
        areaId: "",
        areaName: "",
      },
    };
  }

  toggleLoading = () => {
    this.setState({
      loading: !this.state.loading,
    });
  };

  clearForm = () => {
    this.setState({
      formError: false,
      area: {
        areaId: "",
        areaName: "",
      },
    });
  };

  close = () => {
    this.clearForm();
    this.props.close();
  };

  areaNameChangeHandler = (e) => {
    this.setState({
      area: {
        ...this.state.area,
        areaName: e.target.value,
      },
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.area.areaId !== nextProps.area.areaId ||
      this.props.open !== nextProps.open ||
      this.state !== nextState
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.area.areaId !== prevProps.area.areaId ||
      this.props.open !== prevProps.open
    ) {
      const { area } = this.props;
      this.setState({
        area: {
          areaId: area.areaId,
          areaName: area.areaName,
        },
      });
    }
  }

  updateArea = () => {
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
            console.log(response.data.result[0]);
            this.props.update(response.data.result[0]);
            this.close();
          }
          this.close();
        })
        .catch((err) => {
          console.log(err);
          this.toggleLoading();
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
        header="Update Area"
        open={open}
        close={this.close}
        save={this.updateArea}
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

export default UpdateArea;
