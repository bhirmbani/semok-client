import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react'

import Login from '../components/Login';


class Navbar extends Component {
  render() {
    return (
      <Menu inverted fixed="top" size="massive">
        <Menu.Item name="SEMOK" />

        <Menu.Menu position="right">
          <Menu.Item>
            <Button secondary>Add New Item</Button>
          </Menu.Item>
          <Menu.Item>
            <Login />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Navbar;
