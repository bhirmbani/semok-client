import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

class Monitoring extends Component {
  render() {
    return (
      <Table basic="very" compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Target</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
    );
  }
}

export default Monitoring;
