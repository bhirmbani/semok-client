import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { getItems, closeErrMsgInAddItemForm } from '../actions';
// closeAddItemMsgOk
// closeWelcome
class ErrMsgInAddItemForm extends Component {
  render() {
    let msg = null;
    if (this.props.msgReducer.addItem.msg.isErrMsgShowed) {
      /* below is message that showed in addItem form only when addItem is not success */
      msg = (
        <Message
          header={this.props.msgReducer.addItem.msg.context}
          content={this.props.msgReducer.addItem.msg.content}
          negative
          icon="remove circle"
          onDismiss={() => this.props.closeErrMsgInAddItemForm()}
        />
      );
    }
    return (
      <div>
        { msg }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  msgReducer: state.msgReducer,
});

const mapDispatchToProps = dispatch => ({
  // closeWelcome: () => {
  //   dispatch(closeWelcome());
  // },
  getItems: () => {
    dispatch(getItems());
  },
  closeErrMsgInAddItemForm: () => {
    dispatch(closeErrMsgInAddItemForm());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrMsgInAddItemForm);
