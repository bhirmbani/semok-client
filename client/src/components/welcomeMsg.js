import React, { Component } from 'react';
import { Table, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { closeWelcome, getItems } from '../actions';
import TableItem from './tableItem';

class WelcomeMsg extends Component {

  // componentDidMount() {
  //   this.props.getItems();
  // }

  render() {
    const isToken = localStorage.getItem('token');
    let items = null;
    if (!isToken) {
      items = (<Message
        header="Tidak ada data"
        content="Anda harus login dulu untuk mengakses item KPI"
        positive
        icon="info"
      />);
    } else {
      items = (<TableItem />);
    }

    return (
      <div>
        { (this.props.msgReducer.status.login && this.props.msgReducer.status.welcome) && <Message
          header={this.props.authReducer.userData.msg.context}
          content={`${this.props.authReducer.userData.msg.content}, ${this.props.authReducer.userData.user.name}`}
          positive
          icon="info"
          onDismiss={() => this.props.closeWelcome()}
        /> }
        <div>
          {items}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authReducer: state.authReducer,
  msgReducer: state.msgReducer,
  itemReducer: state.itemReducer,
});

const mapDispatchToProps = dispatch => ({
  closeWelcome: () => {
    dispatch(closeWelcome());
  },
  getItems: () => {
    dispatch(getItems());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeMsg);
