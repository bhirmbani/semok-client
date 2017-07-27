import React, { Component } from 'react';
import { Table, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { closeWelcome } from '../actions';

class TableItem extends Component {

  render() {
    return (
      <div>
        { (this.props.msgReducer.status.login && this.props.msgReducer.status.welcome) && <Message
          header={this.props.authReducer.userData.msg.context}
          content={`${this.props.authReducer.userData.msg.content}, ${this.props.authReducer.userData.user.name}`}
          positive
          icon="info"
          onDismiss={() => this.props.closeWelcome()}
        /> }
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authReducer: state.authReducer,
  msgReducer: state.msgReducer,
});

const mapDispatchToProps = dispatch => ({
  closeWelcome: () => {
    dispatch(closeWelcome());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TableItem);
