import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';


class TableItem extends Component {
  render() {
    return (
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Item KPI</Table.HeaderCell>
            <Table.HeaderCell>Bobot</Table.HeaderCell>
            <Table.HeaderCell>Target</Table.HeaderCell>
            <Table.HeaderCell>Called</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>John Lilki</Table.Cell>
            <Table.Cell>September 14, 2013</Table.Cell>
            <Table.Cell>jhlilk22@yahoo.com</Table.Cell>
            <Table.Cell>No</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default TableItem;
