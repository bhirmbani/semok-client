import React, { Component } from 'react';
import { Table, Message, Popup, Button, Form, Select, Dropdown, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
  getItems,
  closeSuccessAddItemMsgInBelowNavbar,
  getWorkerThatHasNoItemYetForDelegateLogic,
  delegateItem,
  closeSuccessMsgInDelegatingItem,
  closeErrMsgInDelegatingItem,
  getWorkersWithoutAdminForFilterInTableItem,
  getCategoriesForFilteringItem,
  filterItemByItsMakerAndCategory,
  turnOffFilterByItsMakerAndCategory,
} from '../actions';

const styles = {
  centerPos: {
    textAlign: 'center',
  },
  options: {
    cursor: 'pointer',
    fontSize: '1.2em',
  },
  filterDropdown: {
    fontSize: '1.5em',
  },
};

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delegateItemForm: {
        itemId: null,
        workerId: null,
      },
      delegateItemMsg: {
        isSuccessMsgShowed: false,
        isErrMsgShowed: false,
      },
      filterItemProperties: {
        worker: null,
        cat: null,
        desc: null,
      },
    };
  }

  componentDidMount() {
    if (!this.props.itemReducer.items) {
      this.props.getItems();
      this.props.getWorkersWithoutAdminForFilterInTableItem();
      this.props.getCategoriesForFilteringItem();
    }
  }

  onSubmitDelegateForm(e) {
    e.preventDefault();
    this.props.delegateItem(this.state.delegateItemForm);
  }

  renderDropdownOptions() {
    if (this.props.workerReducer.delegateItem.workerList) {
      if (this.props.workerReducer.delegateItem.workerList.length === 0) {
        return (
          <div>
            <Form.Field
              label="Semua pekerja sudah punya item ini"
              disabled
              size="mini"
            />
          </div>
        );
      }
    }
    return (
      <div>
        <Form.Field
          label="Delegasikan kepada:"
          control={Select}
          placeholder="pilih pekerja"
          name="workerId"
          selection
          size="mini"
          fluid
          options={this.props.workerReducer.delegateItem.workerList}
          onChange={(e, { value }) => {
            this.setState({ ...this.state,
              delegateItemForm: {
                workerId: value,
                itemId: this.state.delegateItemForm.itemId,
              } });
          }
          }
        />
        <Button size="mini" primary content="Submit" />
      </div>
    );
  }

  onTurnOffFilterItem(e) {
    e.preventDefault();
    this.props.turnOffFilterByItsMakerAndCategory();
  }

  renderPopupForCategory(item) {
    return (<Popup
      trigger={<span style={styles.options}>{item.Category ? item.Category.name : 'tidak ada kategori'}</span>}
      on="click"
      flowing
      size="mini"
      wide
      position="bottom left"
      // onOpen={() => {
      //   // this.props.getWorkerThatHasNoItemYetForDelegateLogic(item.id);
      //   // const tempState = { ...this.state };
      //   // this.setState({ delegateItemForm: {
      //   //   itemId: item.id,
      //   //   workerId: tempState.delegateItemForm.workerId,
      //   // },
      //   // });
      // }}
    >
      {/* <Form style={styles.centerPos} onSubmit={e => this.onSubmitDelegateForm(e)}>
        {this.renderDropdownOptions()}
      </Form> */}
      {/* <Button size="tiny" icon="info" content="Detail" /> */}
    </Popup>);
  }

  renderPopUpForDescription() {
    
  }

  render() {
    const localState = this.state;
    // let workerDefaultValue = null;
    // const catDefaultValue = null;
    if (!this.props.itemReducer.items) {
      return (
        <div />
      );
    }
    return (
      <div>
        <span style={styles.filterDropdown}>
          Tampilkan item yang dibuat oleh <Dropdown
            inline
            simple
            scrolling
            noResultsMessage="Tidak ada pekerja"
            options={this.props.workerReducer.filterItem.workerList}
            onChange={(e, { value }) => {
              // const tempState = localState.filterItemProperties;
              // const filterItemProperties = {
              //   ...tempState,
              //   worker: value,
              // };
              localState.filterItemProperties.worker = value;
              this.props.filterItemByItsMakerAndCategory(localState.filterItemProperties);
            }}
          />dengan kategori <Dropdown
            inline
            simple
            scrolling
            noResultsMessage="Tidak ada kategori"
            options={this.props.categoryReducer.filterItem.categoryList}
            // defaultValue={catDefaultValue}
            onChange={(e, { value }) => {
              const realValue = value === 0 ? null : value;
              const tempState = localState.filterItemProperties;
              // const filterItemProperties = {
              //   ...tempState,
              //   cat: realValue,
              // };
              localState.filterItemProperties.cat = realValue;
              this.props.filterItemByItsMakerAndCategory(localState.filterItemProperties);
            }}
          />
        </span>
        { /* this is msg to be showed when additem success */ }
        {(this.props.msgReducer.addItem.msg.isSuccessMsgShowed) &&
          <Message
            header={this.props.msgReducer.addItem.msg.context}
            content={this.props.msgReducer.addItem.msg.content}
            positive
            icon="info"
            onDismiss={() => this.props.closeSuccessAddItemMsgInBelowNavbar()}
          /> }
        { /* this is msg when delegate item success */}
        {(this.props.msgReducer.delegateItem.msg.isSuccessMsgShowed) &&
          <Message
            header={this.props.msgReducer.delegateItem.msg.context}
            content={this.props.msgReducer.delegateItem.msg.content}
            positive
            icon="info"
            onDismiss={() => this.props.closeSuccessMsgInDelegatingItem()}
          /> }
        { /* this is msg when delegate item not success */}
        {(this.props.msgReducer.delegateItem.msg.isErrMsgShowed) &&
          <Message
            header={this.props.msgReducer.delegateItem.msg.context}
            content={this.props.msgReducer.delegateItem.msg.content}
            negative
            icon="remove circle"
            onDismiss={() => this.props.closeErrMsgInDelegatingItem()}
          /> }
        { /* <p>Menampilkan semua daftar item yang dibuat oleh
          <span>{localState.filterItemProperties.name}</span>
        dengan kategori
          <span>{localState.filterItemProperties.cat}</span>
        </p> */}
        <Table celled striped padded="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Item KPI</Table.HeaderCell>
              <Table.HeaderCell>Dibuat Oleh</Table.HeaderCell>
              <Table.HeaderCell>Kategori</Table.HeaderCell>
              <Table.HeaderCell>Deskripsi</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {/* di bawah ini list semua item */}
          {(!this.props.itemReducer.isFilterByItsMakerAndCategoryTriggered) &&
            <Table.Body>
              {this.props.itemReducer.items.map(item => (<Table.Row key={item.id}>
                <Table.Cell>
                  <Popup
                    trigger={<span style={styles.options}>{item.name}</span>}
                    on="click"
                    flowing
                    size="mini"
                    wide
                    position="bottom left"
                    onOpen={() => {
                      this.props.getWorkerThatHasNoItemYetForDelegateLogic(item.id);
                      const tempState = { ...this.state };
                      this.setState({ delegateItemForm: {
                        itemId: item.id,
                        workerId: tempState.delegateItemForm.workerId,
                      },
                      });
                    }}
                  >
                    <Form style={styles.centerPos} onSubmit={e => this.onSubmitDelegateForm(e)}>
                      {this.renderDropdownOptions()}
                    </Form>
                    {/* <Button size="tiny" icon="info" content="Detail" /> */}
                  </Popup>
                </Table.Cell>
                <Table.Cell>{item.createdBy}</Table.Cell>
                <Table.Cell>
                  {this.renderPopupForCategory(item)}
                </Table.Cell>
                <Table.Cell>
                  {item.description ? item.description : 'tidak ada deskripsi'}
                </Table.Cell>
                {/* <Table.Cell>{item.Workers.map(worker => worker.name)}</Table.Cell> */}
              </Table.Row>))}
            </Table.Body>}
          {/* di bawah ini list hasil filter */}
          {(this.props.itemReducer.isFilterByItsMakerAndCategoryTriggered) &&
            <Table.Body>
              {this.props.filterItemReducer.filteredItems.map(item => (<Table.Row key={item.id}>
                <Table.Cell>
                  <Popup
                    trigger={<a style={styles.options}>{item.name}</a>}
                    on="click"
                    flowing
                    size="mini"
                    wide
                    position="bottom left"
                    onOpen={() => {
                      this.props.getWorkerThatHasNoItemYetForDelegateLogic(item.id);
                      const tempState = { ...this.state };
                      this.setState({ delegateItemForm: {
                        itemId: item.id,
                        workerId: tempState.delegateItemForm.workerId,
                      },
                      });
                    }}
                  >
                    <Form style={styles.centerPos} onSubmit={e => this.onSubmitDelegateForm(e)}>
                      {this.renderDropdownOptions()}
                    </Form>
                    {/* <Button size="tiny" icon="info" content="Detail" /> */}
                  </Popup>
                </Table.Cell>
                <Table.Cell>{item.createdBy}</Table.Cell>
                <Table.Cell>
                  {this.renderPopupForCategory(item)}
                </Table.Cell>
                <Table.Cell>{item.description ? item.description : 'tidak ada deskripsi'}</Table.Cell>
                {/* <Table.Cell>{item.Workers.map(worker => worker.name)}</Table.Cell> */}
              </Table.Row>))}
            </Table.Body>}
        </Table>
      </div>

    );
  }
}

const mapStateToProps = state => ({
  itemReducer: state.itemReducer,
  msgReducer: state.msgReducer,
  workerReducer: state.workerReducer,
  categoryReducer: state.categoryReducer,
  filterItemReducer: state.filterItemReducer,
});

const mapDispatchToProps = dispatch => ({
  getItems: () => {
    dispatch(getItems());
  },
  closeSuccessAddItemMsgInBelowNavbar: () => {
    dispatch(closeSuccessAddItemMsgInBelowNavbar());
  },
  getWorkerThatHasNoItemYetForDelegateLogic: (itemId) => {
    dispatch(getWorkerThatHasNoItemYetForDelegateLogic(itemId));
  },
  delegateItem: (itemId, workerId) => {
    dispatch(delegateItem(itemId, workerId));
  },
  closeSuccessMsgInDelegatingItem: () => {
    dispatch(closeSuccessMsgInDelegatingItem());
  },
  closeErrMsgInDelegatingItem: () => {
    dispatch(closeErrMsgInDelegatingItem());
  },
  getWorkersWithoutAdminForFilterInTableItem: () => {
    dispatch(getWorkersWithoutAdminForFilterInTableItem());
  },
  getCategoriesForFilteringItem: () => {
    dispatch(getCategoriesForFilteringItem());
  },
  filterItemByItsMakerAndCategory: (properties) => {
    dispatch(filterItemByItsMakerAndCategory(properties));
  },
  turnOffFilterByItsMakerAndCategory: (properties) => {
    dispatch(turnOffFilterByItsMakerAndCategory(properties));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);

