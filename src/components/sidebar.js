import React, { Component } from 'react';
import { Sidebar, Grid, Menu, Label, Icon, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';

import MsgAtTheBottomOfNavbar from './msgAtTheBottomOfNavbar';
import Statistic from './statistic';
import Monitoring from './monitoring';
import ItemSaya from './itemSaya';
import decodeHelper from '../helpers';

const userData = decodeHelper.decode(localStorage.getItem('token'));
const isToken = localStorage.getItem('token');

class SidebarComponent extends Component {
  processItemListColumnWidth() {
    let value = 16;
    if (this.props.msgReducer.loginStatus.isUserSuccessfullyLogin) {
      value = 13;
    } else if (this.props.msgReducer.loginStatus.isSidebar && isToken) {
      value = 13;
    } else if (!this.props.msgReducer.loginStatus.isSidebar) {
      value = 16;
    }
    return value;
  }

  processColumn() {
    let value = 1;
    if (this.props.msgReducer.loginStatus.isUserSuccessfullyLogin) {
      value = 2;
    } else if (isToken) {
      value = 2;
    } else if (!this.props.msgReducer.loginStatus.isSidebar) {
      value = 1;
    }
    return value;
  }

  renderUserRoleColor() {
    let color = '';
    const condition = userData ?
      userData.ok :
      this.props.msgReducer.loginStatus.isUserSuccessfullyLogin;
    if (condition) {
      switch (userData ? userData.role : this.props.authReducer.userData.user.role) {
        case 'manager':
          color = 'red';
          break;
        case 'asmen':
          color = 'yellow';
          break;
        case 'staff':
          color = 'blue';
          break;
        case 'admin':
          color = 'purple';
          break;
        default:
          color = 'white';
      }
      return color;
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Row columns={this.processColumn()}>
          { (this.props.authReducer.userData.user.name && this.props.msgReducer.loginStatus.isSidebar)
            && <Grid.Column width={3}>
              <Sidebar as={Menu} />
              <Segment vertical>
                { /* 1 */ }
                <Menu.Item name="user">
                  <Label as="a" color={this.renderUserRoleColor()}>
                    <Icon name="user" />
                    {this.props.authReducer.userData.user.name ?
                      this.props.authReducer.userData.user.name :
                      userData.name}
                    <Label.Detail>{this.props.authReducer.userData ?
                      this.props.authReducer.userData.user.role :
                      userData.role}</Label.Detail>
                  </Label>
                </Menu.Item>
              </Segment>
            </Grid.Column>
          }
          {(this.props.msgReducer.loginStatus.isSidebar && isToken)
            && <Grid.Column width={3}>
              <Sidebar as={Menu} vertical width="thin" icon="labeled" />
              <Segment vertical>
                { /* 1 */ }
                <Menu.Item name="user">
                  <Label as="a" color={this.renderUserRoleColor()}>
                    <Icon name="user" />
                    {userData ? userData.name : ''}
                    <Label.Detail>{userData ? userData.role : ''}</Label.Detail>
                  </Label>
                </Menu.Item>
              </Segment>
              { /* 2 */ }
              <Segment vertical>
                <Menu.Item name="list">
                  <Link to={'/'}>Daftar Semua Item</Link>
                </Menu.Item>
                <Menu.Item name="statistic">
                  <Link to={'/statistik'}>Statistik Item</Link>
                </Menu.Item>
                <Menu.Item name="monitor">
                  <Link to={'/monitor'}>Monitor Items</Link>
                </Menu.Item>
                <Menu.Item name="item-saya">
                  <Link to={'/item-saya'}>Item Saya</Link>
                </Menu.Item>
              </Segment>
            </Grid.Column>
          }
          {(!this.props.msgReducer.loginStatus.isSidebar)
            && <div />
          }
          <Grid.Column width={this.processItemListColumnWidth()}>
            {(isToken) &&
              <Route path={'/statistik'} component={Statistic} />
            }
            <Route exact path={'/'} component={MsgAtTheBottomOfNavbar} />
            <Route exact path={'/monitor'} component={Monitoring} />
            <Route exact path={'/item-saya'} component={ItemSaya} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  msgReducer: state.msgReducer,
  authReducer: state.authReducer,
});

export default connect(mapStateToProps, null)(SidebarComponent);
