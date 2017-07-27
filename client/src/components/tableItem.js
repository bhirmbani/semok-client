import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { getItems } from '../actions';

class TableItem extends Component {

  componentDidMount() {
    return this.props.getItems();
  }

  render() {
    if (this.props.itemReducer.items === '') {
      return (
        <div />
      );
    }
    return (
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Item KPI</Table.HeaderCell>
            <Table.HeaderCell>Dibuat Oleh</Table.HeaderCell>
            <Table.HeaderCell>Kategori</Table.HeaderCell>
            <Table.HeaderCell>Pemilik Item</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.itemReducer.items.map((item, idx) => (<Table.Row key={item.id}>
            <Table.Cell> <a href="#">{item.name}</a> </Table.Cell>
            <Table.Cell>{item.createdBy}</Table.Cell>
            <Table.Cell>{item.Category.name}</Table.Cell>
            <Table.Cell>{item.Workers.map(worker => worker.name )}</Table.Cell>
          </Table.Row>))}
        </Table.Body>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  itemReducer: state.itemReducer,
});

const mapDispatchToProps = dispatch => ({
  getItems: () => {
    dispatch(getItems());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TableItem);

