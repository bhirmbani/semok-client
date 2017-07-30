import React, { Component } from 'react';
import { Table, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { getItems, closeSuccessAddItemMsgInBelowNavbar } from '../actions';

class ItemList extends Component {
  componentDidMount() {
    this.props.getItems();
  }

  render() {
    if (!this.props.itemReducer.items) {
      return (
        <div />
      );
    }
    return (
      <div>
        { /* this is msg to be showed when additem success */ }
        {(this.props.msgReducer.addItem.msg.isSuccessMsgShowed) &&
          <Message
            header={this.props.msgReducer.addItem.msg.context}
            content={this.props.msgReducer.addItem.msg.content}
            positive
            icon="info"
            onDismiss={() => this.props.closeSuccessAddItemMsgInBelowNavbar()}
          /> }
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
              <Table.Cell>{item.Category ? item.Category.name : 'tidak ada kategori'}</Table.Cell>
              <Table.Cell>{item.Workers.map(worker => worker.name)}</Table.Cell>
            </Table.Row>))}
          </Table.Body>
        </Table>
      </div>

    );
  }
}

const mapStateToProps = state => ({
  itemReducer: state.itemReducer,
  msgReducer: state.msgReducer,
});

const mapDispatchToProps = dispatch => ({
  getItems: () => {
    dispatch(getItems());
  },
  closeSuccessAddItemMsgInBelowNavbar: () => {
    dispatch(closeSuccessAddItemMsgInBelowNavbar());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);

