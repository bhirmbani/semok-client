import React, { Component } from 'react';
import { Button, Dropdown, Menu } from 'semantic-ui-react'

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
            <Button primary>Register</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Navbar;
