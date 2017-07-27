import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Button, Icon, Message } from 'semantic-ui-react';

import Login from '../components/Login';
import { logout, loginFalse } from '../actions';


class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  render() {
    const isLogin = this.props.msgReducer.status.login;
    const isToken = localStorage.getItem('token');
    let btn = null;
    if (isLogin || isToken) {
      btn = (<div>
        <Button
          onClick={() => this.props.logout()}
          floated="right"
          color="red"
        >
          <Icon name="sign out" />Logout
        </Button>
      </div>
      );
    } else {
      btn = <Login />;
    }
    return (
      <div>
        <Menu inverted fixed="top" size="massive">
          <Menu.Item name="SEMOK" />

          <Menu.Menu position="right">
            <Menu.Item>
              <Button secondary>Add New Item</Button>
            </Menu.Item>
            <Menu.Item>
              {btn}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authReducer: state.authReducer,
  msgReducer: state.msgReducer,
});

const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
