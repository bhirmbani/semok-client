import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Button, Icon } from 'semantic-ui-react';
import createHistory from 'history/createBrowserHistory';

import Login from '../components/Login';
import AddItemFormModal from '../components/addItemFormModal';
import { logout } from '../actions';


const history = createHistory();
// const location = history.location;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  render() {
    const isLogin = this.props.msgReducer.loginStatus.isUserSuccessfullyLogin;
    const isToken = localStorage.getItem('token');
    let btn = null;
    if (isLogin || isToken) {
      btn = (<div>
        <Button
          onClick={() => { this.props.logout(); history.replace({ pathname: '/' }); document.location.href = '/'; }}
          floated="right"
          color="red"
        >
          <Icon name="sign out" />
          Keluar
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
            {(isLogin || isToken) && <Menu.Item>
              <AddItemFormModal />
            </Menu.Item>}
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
