import React, { Component } from "react";
import { Table } from "semantic-ui-react";

class EmptyRow extends Component {
  render() {
    return (
      <Table.Row positive>
        <Table.Cell></Table.Cell>
        <Table.Cell>No Data available. Start adding.</Table.Cell>
      </Table.Row>
    );
  }
}

export default EmptyRow;
