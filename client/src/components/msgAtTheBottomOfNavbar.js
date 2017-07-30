import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { closeWelcomeMsg, getItems } from '../actions';
import ItemList from './itemList';

class MsgAtTheBottomOfNavbar extends Component {
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
      items = (<ItemList />);
    }
    return (
      <div>
        { /* di bawah ini adalah welcome message yang muncul saat user berhasil login */}
        { (this.props.msgReducer.loginStatus.isUserSuccessfullyLogin &&
          this.props.msgReducer.loginStatus.isWelcomeMsgShowed) &&
          <Message
            header={this.props.authReducer.userData.msg.context}
            content={`${this.props.authReducer.userData.msg.content}, ${this.props.authReducer.userData.user.name}`}
            positive
            icon="info"
            onDismiss={() => this.props.closeWelcomeMsg()}
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
  closeWelcomeMsg: () => {
    dispatch(closeWelcomeMsg());
  },
  getItems: () => {
    dispatch(getItems());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MsgAtTheBottomOfNavbar);
