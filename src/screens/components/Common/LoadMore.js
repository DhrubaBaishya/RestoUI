import React, { Component } from "react";
import { Button, Icon } from "semantic-ui-react";

class LoadMore extends Component {
  render() {
    return (
      <Button
        icon
        labelPosition="right"
        onClick={this.props.loadMore}
        loading={this.props.loading}
        disabled={this.props.loading}
      >
        Load More
        <Icon name="right arrow" />
      </Button>
    );
  }
}

export default LoadMore;
