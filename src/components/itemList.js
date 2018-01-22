import React, { Component } from "react";
import {
  Table,
  Message,
  Popup,
  Button,
  Form,
  Select,
  Dropdown,
  Icon,
  Header,
  Input,
  TextArea,
  Divider,
  Container,
  Segment,
  Dimmer,
  Loader
} from "semantic-ui-react";
import { connect } from "react-redux";
import numeral from "numeral";
import { notify } from "react-notify-toast";
import helpers from "../helpers";
import { itemTableStyles as styles } from "../helpers/styles";

import {
  getItems,
  closeAddItemSuccessMsg,
  getWorkerThatHasNoItemYetForDelegateLogic,
  delegateItem,
  // closeSuccessMsgInDelegatingItem,
  // closeErrMsgInDelegatingItem,
  getWorkersWithoutAdminForFilterInTableItem,
  getCategoriesForFilteringItem,
  // filterItemByItsMakerAndCategory,
  // turnOffFilterByItsMakerAndCategory,
  addItemBaseAndStretchInTarget,
  removeMsgFromAddTarget,
  addValueInProgressItem,
  getTargetsFromFirebase,
  getProgressesFromFirebase,
  getAddItemFromFirebase,
  editItemName,
  getEditItemFromFirebase,
  updateUnitName,
  getPerformancesByItemAndWorker,
  updateBobotValue,
  getAllCategory,
  createNewCategory,
  assignCatToItem,
  addDescription,
  filterItemByName,
  turnOffFilterByName
} from "../actions";

import DeleteItemModal from "./deleteItemModal";

const whoami = helpers.decode(localStorage.getItem("token"));

const processDot = status => {
  let style = null;

  const processDotStyle = stats => {
    if (stats === "red") {
      style = {
        fontSize: "0.70em",
        padding: "0.6em",
        color: "#FF2C2C" // FF4545
        // cursor: 'pointer',
      };
    } else if (stats === "green") {
      style = {
        fontSize: "0.70em",
        padding: "0.6em",
        color: "#58E481"
        // cursor: 'pointer',
      };
    } else if (stats === "star") {
      style = {
        fontSize: "0.70em",
        padding: "0.6em",
        color: "#FFD480" // FBE6A2 F6C90E FAF15D
        // cursor: 'pointer',
      };
    } else {
      style = {
        fontSize: "0.70em",
        padding: "0.6em",
        color: "black"
        // cursor: 'pointer',
      };
    }
    return style;
  };

  switch (status) {
    case "red":
      return <Icon style={processDotStyle(status)} name="circle" />;
    case "green":
      return <Icon style={processDotStyle(status)} name="circle" />;
    case "star":
      return <Icon style={processDotStyle(status)} name="star" />;
    default:
      return <Icon style={processDotStyle(status)} name="circle" />;
  }
};

const sortPerformance = array => {
  array.sort((a, b) => a.period - b.period);
};

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delegateItemForm: {
        itemId: null,
        workerId: null
      },
      delegateItemMsg: {
        isSuccessMsgShowed: false,
        isErrMsgShowed: false
      },
      filterItemProperties: {
        worker: null,
        cat: null,
        desc: null,
        name: null
      },
      addTargetForm: {
        itemId: null,
        base: null,
        stretch: null,
        period: null
      },
      addProgressForm: {
        itemId: null,
        period: null,
        value: null
      },
      editItemName: {
        itemId: null,
        name: null
      },
      isDeleteModal: false,
      deleteItemForm: {
        itemId: null,
        itemIdx: null
      },
      unitNameForm: {
        name: null,
        itemId: null
      },
      updateBobotForm: {
        itemId: null,
        value: null,
        workerId: null
      },
      isAddCategory: false,
      isEditDescription: false,
      addCategoryForm: {
        name: null
      },
      assignCatForm: {
        itemId: null,
        categoryId: null
      },
      addDescForm: {
        itemId: null,
        description: null
      },
      isFetchCatLoading: false,
      tempDesc: {
        itemId: null,
        description: undefined
      }
    };
  }

  getPerformances(itemId, workerId) {
    const itemState = this.props.itemReducer.items;
    const itemIdx = itemState.findIndex(each => each.id === itemId);
    const workerIdx = itemState[itemIdx].Workers.findIndex(
      each => each.id === workerId
    );
    // if (!this.props.itemReducer.items[itemIdx].Workers[workerIdx].Performances) {
    this.props.getPerformancesByItemAndWorker(itemId, workerId);
    // }
  }

  componentDidMount() {
    if (!this.props.itemReducer.items) {
      this.props.getItems();
      this.props.getWorkersWithoutAdminForFilterInTableItem();
      this.props.getCategoriesForFilteringItem();
    }
    this.props.getTargetsFromFirebase();
    this.props.getProgressesFromFirebase();
    this.props.getAddItemFromFirebase();
    this.props.getEditItemFromFirebase();
  }

  onSubmitProgressForm(e, positionData) {
    e.preventDefault();
    this.props.addValueInProgressItem(this.state.addProgressForm, positionData);
  }

  onSubmitTargetForm(e, itemIdx, targetIdx, period) {
    e.preventDefault();
    this.props.addItemBaseAndStretchInTarget(
      this.state.addTargetForm,
      itemIdx,
      targetIdx,
      period
    );
    this.props.removeMsgFromAddTarget();
  }

  onSubmitDelegateForm(e) {
    e.preventDefault();
    this.props.delegateItem(this.state.delegateItemForm);
  }

  componentDidUpdate() {
    if (this.props.msgReducer.addTarget.msg.isSuccessMsgShowed) {
      notify.show(this.props.msgReducer.addTarget.msg.content, "success", 1500);
    } else if (this.props.msgReducer.addTarget.msg.isErrMsgShowed) {
      notify.show(this.props.msgReducer.addTarget.msg.content, "error", 1500);
    } else if (this.props.msgReducer.addProgress.msg.isSuccessMsgShowed) {
      notify.show(
        this.props.msgReducer.addProgress.msg.content,
        "success",
        1500
      );
    } else if (this.props.msgReducer.addProgress.msg.isErrMsgShowed) {
      notify.show(this.props.msgReducer.addProgress.msg.content, "error", 1500);
    } else if (this.props.msgReducer.addItem.msg.isSuccessMsgShowed) {
      notify.show(this.props.msgReducer.addItem.msg.content, "success", 1500);
    } else if (this.props.msgReducer.editItemName.msg.isErrMsgShowed) {
      notify.show(
        this.props.msgReducer.editItemName.msg.content,
        "success",
        1500
      );
    } else if (this.props.msgReducer.editItemName.msg.isSuccessMsgShowed) {
      notify.show(
        this.props.msgReducer.editItemName.msg.content,
        "error",
        1500
      );
    } else if (this.props.msgReducer.deleteItem.msg.isSuccessMsgShowed) {
      notify.show(
        this.props.msgReducer.deleteItem.msg.content,
        "success",
        1500
      );
    } else if (this.props.msgReducer.updateUnitName.msg.isSuccessMsgShowed) {
      notify.show(
        this.props.msgReducer.updateUnitName.msg.content,
        "success",
        1500
      );
    } else if (this.props.msgReducer.updateUnitName.msg.isErrMsgShowed) {
      notify.show(
        this.props.msgReducer.updateUnitName.msg.content,
        "error",
        2000
      );
    } else if (this.props.msgReducer.editBobot.msg.isSuccessMsgShowed) {
      notify.show(this.props.msgReducer.editBobot.msg.content, "success", 1500);
    } else if (this.props.msgReducer.editBobot.msg.isErrMsgShowed) {
      notify.show(this.props.msgReducer.editBobot.msg.content, "error", 1500);
    } else if (this.props.msgReducer.delegateItem.msg.isErrMsgShowed) {
      notify.show(
        this.props.msgReducer.delegateItem.msg.content,
        "error",
        1500
      );
    } else if (this.props.msgReducer.delegateItem.msg.isSuccessMsgShowed) {
      notify.show(
        this.props.msgReducer.delegateItem.msg.content,
        "success",
        1500
      );
    }
  }

  onSubmitEditBobot(e) {
    e.preventDefault();
    this.props.updateBobotValue(this.state.updateBobotForm);
  }

  onSubmitEditItem(e, itemIdx) {
    e.preventDefault();
    this.props.editItemName(
      this.state.editItemName.itemId,
      this.state.editItemName.name,
      itemIdx
    );
  }

  onSubmitEditUnitName(e) {
    e.preventDefault();
    this.props.updateUnitName(this.state.unitNameForm);
  }

  onTurnOffFilterItem(e) {
    e.preventDefault();
    this.props.turnOffFilterByItsMakerAndCategory();
  }

  onSubmitAssignCat() {
    this.props.assignCatToItem(this.state.assignCatForm);
  }

  renderPopUpForDescription() {}

  // showAddItemSuccessMsg() {
  //   if (this.props.msgReducer.addItem.msg.isSuccessMsgShowed) {
  //     notify.show(this.props.msgReducer.addItem.msg.content, 'success', 2000);
  //   }
  // }

  // showAddTargetMsg() {
  //   if (this.props.msgReducer.addTarget.msg.isSuccessMsgShowed) {
  //     notify.show(this.props.msgReducer.addTarget.msg.content, 'success', 2000);
  //   } else if (this.props.msgReducer.addTarget.msg.isErrMsgShowed) {
  //     notify.show(this.props.msgReducer.addTarget.msg.content, 'error', 2000);
  //   }
  // }

  // showAddProgressMsg() {
  //   if (this.props.msgReducer.addProgress.msg.isSuccessMsgShowed) {
  //     notify.show(this.props.msgReducer.addProgress.msg.content, 'success', 2000);
  //   } else if (this.props.msgReducer.addProgress.msg.isErrMsgShowed) {
  //     notify.show(this.props.msgReducer.addProgress.msg.content, 'error', 2000);
  //   }
  // }

  renderPopupForCategory(item) {
    return (
      <Popup
        trigger={
          <span style={styles.itemCat}>
            {item.Category ? item.Category.name : "tidak ada kategori"}
          </span>
        }
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
      </Popup>
    );
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
            this.setState({
              ...this.state,
              delegateItemForm: {
                workerId: value,
                itemId: this.state.delegateItemForm.itemId
              }
            });
          }}
        />
        <Button size="mini" primary content="Submit" />
      </div>
    );
  }

  filterPerformanceValue(performance, itemId) {
    if (performance.itemId === itemId) {
      return `${numeral(performance.value).format("0.00")} %`;
    }
  }

  filterPerformanceMonth(performance, itemId) {
    if (performance.itemId === itemId) {
      return `${helpers.processMonthName(performance.period)}`;
    }
  }

  findBobot(a, b) {
    let value = null;
    if (a.id === b.ItemId) {
      value = `${b.value} %`;
    }
    return value;
  }

  render() {
    const localState = this.state;
    if (!this.props.itemReducer.items) {
      return (
        <div>
          <Dimmer active inverted>
            <Loader size="massive">Mengambil Daftar Item...</Loader>
          </Dimmer>
        </div>
      );
    }
    return (
      <div>
        <DeleteItemModal
          deleteForm={this.state.deleteItemForm}
          state={this}
          isDeleteModal={this.state.isDeleteModal}
        />
        <div style={styles.filterDropdownParent}>
          <Dropdown
            style={styles.filterDropdown}
            search
            placeholder="Filter berdasarkan nama"
            selection
            noResultsMessage="Tidak ada item ditemukan"
            options={this.props.itemReducer.filterItem.itemOptionsList}
            onChange={(e, { value }) => {
              // const tempState = localState.filterItemProperties;
              // const filterItemProperties = {
              //   ...tempState,
              //   worker: value,
              // };
              localState.filterItemProperties.name = value;
              this.props.filterItemByName(localState.filterItemProperties);
            }}
          />
          <Button
            onClick={() => this.props.turnOffFilterByName()}
            style={{ marginLeft: "20px" }}
            size="huge"
            secondary
          >
            Reset
          </Button>
        </div>
        {/*<span style={styles.filterDropdown}>
          Tampilkan item yang dimiliki oleh <Dropdown
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
              // const tempState = localState.filterItemProperties;
              // const filterItemProperties = {
              //   ...tempState,
              //   cat: realValue,
              // };
              localState.filterItemProperties.cat = realValue;
              this.props.filterItemByItsMakerAndCategory(localState.filterItemProperties);
            }}
          />
          </span> */}
        {
          /* this is msg to be showed when add target success or error */
          // this.showAddTargetMsg()
        }
        {/* this is msg to be showed when additem success */}
        {
          // this.showAddItemSuccessMsg()
        }
        {/* this is msg to be showed when addprogress value success or error */}
        {
          // this.showAddProgressMsg()
        }
        {/* this is msg when delegate item success */}
        {/* {(this.props.msgReducer.delegateItem.msg.isSuccessMsgShowed) &&
          <Message
            header={this.props.msgReducer.delegateItem.msg.context}
            content={this.props.msgReducer.delegateItem.msg.content}
            positive
            icon="info"
            onDismiss={() => this.props.closeSuccessMsgInDelegatingItem()}
          /> } */}
        {/* this is msg when delegate item not success */}
        {/* {(this.props.msgReducer.delegateItem.msg.isErrMsgShowed) &&
          <Message
            header={this.props.msgReducer.delegateItem.msg.context}
            content={this.props.msgReducer.delegateItem.msg.content}
            negative
            icon="remove circle"
            onDismiss={() => this.props.closeErrMsgInDelegatingItem()}
          /> } */}
        {/* <p>Menampilkan semua daftar item yang dibuat oleh
          <span>{localState.filterItemProperties.name}</span>
        dengan kategori
          <span>{localState.filterItemProperties.cat}</span>
        </p> */}
        <Table textAlign="center" celled striped padded="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Item KPI</Table.HeaderCell>
              {/* <Table.HeaderCell>Kategori</Table.HeaderCell> */}
              {/* <Table.HeaderCell>Deskripsi</Table.HeaderCell> */}
              <Table.HeaderCell>Target</Table.HeaderCell>
              <Table.HeaderCell>
                Progress
                <Icon name="line chart" style={styles.titleIcon} />
              </Table.HeaderCell>
              <Table.HeaderCell style={{ width: "11em" }}>
                Deviation
              </Table.HeaderCell>
              <Table.HeaderCell>Performance</Table.HeaderCell>
              <Table.HeaderCell>Shared With</Table.HeaderCell>
              <Table.HeaderCell>Info Item</Table.HeaderCell>
              {/* <Table.HeaderCell>Item Action</Table.HeaderCell> */}
            </Table.Row>
          </Table.Header>
          {/* di bawah ini list semua item */}
          {!this.props.itemReducer.isFilterByNameTriggered && (
            <Table.Body>
              {this.props.itemReducer.items.map((item, itemIdx) => (
                <Table.Row key={item.name}>
                  <Table.Cell>
                    <Popup
                      trigger={
                        <div style={styles.popupParent}>
                          <span style={styles.itemName}>{item.name}</span>
                        </div>
                      }
                      on="click"
                      flowing
                      size="mini"
                      wide
                      position="left center"
                      onOpen={() => {
                        this.props.getWorkerThatHasNoItemYetForDelegateLogic(
                          item.id
                        );
                        const tempState = { ...this.state };
                        this.setState({
                          delegateItemForm: {
                            itemId: item.id,
                            workerId: tempState.delegateItemForm.workerId
                          }
                        });
                      }}
                    >
                      <Form
                        style={styles.centerPos}
                        onSubmit={e => this.onSubmitDelegateForm(e)}
                      >
                        {this.renderDropdownOptions()}
                      </Form>
                      {/* <Button size="tiny" icon="info" content="Detail" /> */}
                    </Popup>

                    <div style={styles.inlineParent}>
                      <span style={styles.editDeleteItem}>
                        {(whoami
                          ? whoami.name === item.createdBy
                          : this.props.authReducer.userData.user.name ===
                            item.createdBy) && (
                          <Popup
                            size="mini"
                            trigger={
                              <span style={styles.borderBottom}>Edit Nama</span>
                            }
                            on="click"
                            position="bottom center"
                            onOpen={() => {
                              this.setState({
                                editItemName: {
                                  ...this.state.editItemName,
                                  itemId: item.id
                                }
                              });
                            }}
                            onClose={() => {
                              this.setState({
                                editItemName: {
                                  itemId: item.id,
                                  name: null
                                }
                              });
                            }}
                          >
                            <Form
                              onSubmit={e => this.onSubmitEditItem(e, itemIdx)}
                              style={{
                                width: "120px",
                                textAlign: "center"
                              }}
                            >
                              <Form.Field>
                                <Input
                                  size="mini"
                                  placeholder="masukan nama baru"
                                  onChange={(e, { value }) => {
                                    localState.editItemName.itemId = item.id;
                                    localState.editItemName.name = value;
                                    this.setState({
                                      editItemName: localState.editItemName
                                    });
                                  }}
                                />
                              </Form.Field>
                              <Button type="submit" primary size="tiny">
                                Submit
                              </Button>
                            </Form>
                          </Popup>
                        )}
                      </span>
                      <br />
                      {(whoami
                        ? whoami.name === item.createdBy
                        : this.props.authReducer.userData.user.name ===
                          item.createdBy) && (
                        <span
                          onClick={() =>
                            this.setState({
                              isDeleteModal: true,
                              deleteItemForm: {
                                itemId: item.id,
                                itemIdx,
                                name: item.name
                              }
                            })
                          }
                          style={styles.borderBottom}
                        >
                          Hapus
                        </span>
                      )}
                    </div>
                    {/* <div>
                    <Popup
                      trigger={<span style={styles.itemInfo}><Icon name="info circle" />{item.Units[0].name ? item.Units[0].name : ''}</span>}
                      content="nilai satuan"
                      position="bottom center"
                      size="mini"
                      wide="very"
                    />
                  </div> */}
                    {/* <div>
                    <Popup
                      trigger={<span style={styles.itemInfo}><Icon name="hashtag" />{item.Category ? item.Category.name : '-'}</span>}
                      content="nama kategori"
                      position="bottom center"
                      size="mini"
                      wide="very"
                    />
                  </div> */}
                    {/* <div>
                    <Popup
                      trigger={<span style={styles.itemInfo}>deskripsi</span>}
                      content={<span>{item.description ? item.description : '-'}</span>}
                      position="bottom center"
                      size="mini"
                      wide="very"
                      on="click"
                    />
                  </div> */}
                  </Table.Cell>
                  {/* <Table.Cell>
                  {this.renderPopupForCategory(item)}
                </Table.Cell> */}
                  {/* <Table.Cell>
                  <Popup
                    trigger={<div style={styles.popupParent}>
                      {<span style={styles.borderBottom}>
                        {item.description ? item.description : 'tidak ada deskripsi'}
                      </span>}
                    </div>}
                    on="click"
                    size="mini"
                    position="top center"
                  >
                    <Form style={{ width: '90px', textAlign: 'center' }}>
                      <Form.Field>
                        <TextArea
                          placeholder="Isi deskripsinya.."
                          autoHeight
                        />
                      </Form.Field>
                      <Form.Field>
                        <Button size="tiny" primary type="submit">Submit</Button>
                      </Form.Field>
                    </Form>
                  </Popup>
                </Table.Cell> */}
                  <Table.Cell>
                    {item.Targets.map((target, targetIdx) => (
                      <div key={target.id}>
                        <Popup
                          position="top center"
                          trigger={
                            <div style={styles.popupParent}>
                              {
                                <span style={styles.borderBottom}>
                                  {helpers.processMonthName(target.period)}
                                </span>
                              }
                            </div>
                          }
                          on="click"
                          size="mini"
                          wide
                          onOpen={() =>
                            this.setState({
                              addTargetForm: {
                                itemId: item.id,
                                base: null,
                                stretch: null,
                                period: target.period
                              }
                            })
                          }
                          onClose={() => this.props.removeMsgFromAddTarget()}
                        >
                          <Form
                            onSubmit={e =>
                              this.onSubmitTargetForm(
                                e,
                                itemIdx,
                                targetIdx,
                                target.period
                              )
                            }
                            style={{ width: "90px", textAlign: "center" }}
                          >
                            <Form.Field>
                              <Input
                                // required
                                labelPosition="left"
                                size="mini"
                                placeholder="base"
                                iconPosition="left"
                                onChange={(e, { value }) => {
                                  const cleanValue = value
                                    .replace(/[,]+/g, ".")
                                    .trim();
                                  localState.addTargetForm.base = cleanValue;
                                  e.target.value = cleanValue;
                                  localState.addTargetForm.itemId = item.id;
                                  localState.addTargetForm.period =
                                    target.period;
                                  this.setState({
                                    addTargetForm: localState.addTargetForm
                                  });
                                  this.setState({
                                    addTargetForm: {
                                      ...localState.addTargetForm,
                                      stretch: localState.addTargetForm.stretch
                                        ? localState.addTargetForm.stretch
                                        : target.stretch
                                    }
                                  });
                                  if (value === "") {
                                    this.setState({
                                      addTargetForm: {
                                        ...localState.addTargetForm,
                                        base: null,
                                        stretch: null
                                      }
                                    });
                                  }
                                }}
                              >
                                <input />
                                <Icon
                                  name="circle"
                                  style={styles.successIcon}
                                />
                              </Input>
                            </Form.Field>
                            <Form.Field>
                              <Input
                                // required
                                labelPosition="left"
                                size="mini"
                                placeholder="stretch"
                                iconPosition="left"
                                onChange={(e, { value }) => {
                                  const cleanValue = value
                                    .replace(/[,]+/g, ".")
                                    .trim();
                                  localState.addTargetForm.stretch = cleanValue;
                                  e.target.value = cleanValue;
                                  localState.addTargetForm.itemId = item.id;
                                  localState.addTargetForm.period =
                                    target.period;
                                  this.setState({
                                    addTargetForm: localState.addTargetForm
                                  });
                                  this.setState({
                                    addTargetForm: {
                                      ...localState.addTargetForm,
                                      base: localState.addTargetForm.base
                                        ? localState.addTargetForm.base
                                        : target.base
                                    }
                                  });
                                  if (value === "") {
                                    this.setState({
                                      addTargetForm: {
                                        ...localState.addTargetForm,
                                        stretch: null,
                                        base: null
                                      }
                                    });
                                  }
                                }}
                              >
                                <input />
                                <Icon name="star" style={styles.starIcon} />
                              </Input>
                            </Form.Field>
                            <Button size="tiny" primary type="submit">
                              Submit
                            </Button>
                          </Form>
                        </Popup>
                        <div style={styles.inlineParent}>
                          <span>
                            <Icon name="circle" style={styles.successIcon} />
                            {target.base ? target.base : 0}
                          </span>
                          <span>
                            <Icon name="star" style={styles.starIcon} />
                            {target.stretch ? target.stretch : 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    {item.Progresses.map((progress, progressIdx) => (
                      <div key={progress.id}>
                        <Popup
                          position="top center"
                          trigger={
                            <div style={styles.popupParent}>
                              {
                                <span style={styles.borderBottom}>
                                  {helpers.processMonthName(progress.period)}
                                </span>
                              }
                            </div>
                          }
                          on="click"
                          size="mini"
                          wide
                          onOpen={() =>
                            this.setState({
                              addProgressForm: {
                                itemId: item.id,
                                value: null,
                                period: progress.period
                              }
                            })
                          }
                        >
                          <Form
                            onSubmit={e =>
                              this.onSubmitProgressForm(e, {
                                itemIdx,
                                progressIdx
                              })
                            }
                            style={{ width: "110px", textAlign: "center" }}
                          >
                            <Form.Field>
                              <Input
                                labelPosition="left"
                                size="mini"
                                placeholder="nilai progress"
                                iconPosition="left"
                                onChange={(e, { value }) => {
                                  const cleanValue = value
                                    .replace(/[,]+/g, ".")
                                    .trim();
                                  localState.addProgressForm.value = cleanValue;
                                  e.target.value = cleanValue;
                                  localState.addProgressForm.itemId = item.id;
                                  localState.addProgressForm.period =
                                    progress.period;
                                  localState.addProgressForm.value = cleanValue;
                                  this.setState({
                                    addProgressForm: localState.addProgressForm
                                  });
                                }}
                              >
                                <input />
                                <Icon name="line chart" />
                              </Input>
                            </Form.Field>
                            <Button size="tiny" primary type="submit">
                              Submit
                            </Button>
                          </Form>
                        </Popup>
                        <div style={styles.inlineParent}>
                          <span>{progress.value ? progress.value : 0}</span>
                        </div>
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell style={styles.paddingCell}>
                    {/* <Table.Cell> */}
                    {item.Statuses.map(status => (
                      <div style={styles.itemProperties} key={status.id}>
                        <div>
                          {helpers.processMonthName(status.period)}
                          {processDot(status.stats)}
                        </div>
                        <div style={styles.inlineParent}>
                          <span>
                            {status.value
                              ? `${numeral(status.value).format("0.0")} %`
                              : "0 %"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell style={styles.paddingCell}>
                    {item.Workers.map(worker => (
                      <div style={styles.itemProperties} key={worker.id}>
                        <Popup
                          trigger={
                            <div style={styles.popupParent}>
                              <span style={styles.borderBottom}>
                                {worker.name}
                              </span>
                            </div>
                          }
                          on="click"
                          position="top center"
                          size="tiny"
                          onOpen={() =>
                            this.getPerformances(item.id, worker.id)
                          }
                          wide="very"
                        >
                          {worker.Performances &&
                            sortPerformance(worker.Performances)}
                          {worker.Performances &&
                            worker.Performances.map(performance => (
                              <div
                                key={performance.id}
                                style={styles.centerPos}
                              >
                                <span>
                                  <strong>
                                    {this.filterPerformanceMonth(
                                      performance,
                                      item.id
                                    )}
                                  </strong>
                                </span>
                                <br />
                                <span>
                                  {this.filterPerformanceValue(
                                    performance,
                                    item.id
                                  )}
                                </span>
                              </div>
                            ))}
                          {worker.Performances &&
                            worker.Performances.length < 1 && (
                              <div>Isi progress dulu</div>
                            )}
                          {!worker.Performances && <div>Loading...</div>}
                        </Popup>
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    {item.Workers.map(worker => (
                      <div style={styles.itemProperties} key={worker.id}>
                        <div>
                          <Popup
                            trigger={
                              <span style={styles.borderBottom}>
                                {worker.name}
                              </span>
                            }
                            on="click"
                            position="right center"
                          >
                            <Form
                              onSubmit={e => this.onSubmitEditBobot(e)}
                              style={{
                                width: "120px",
                                textAlign: "center"
                              }}
                            >
                              <Form.Field>
                                <Input
                                  size="mini"
                                  placeholder="masukan nilai bobot"
                                  onChange={(e, { value }) => {
                                    localState.updateBobotForm.itemId = item.id;
                                    localState.updateBobotForm.workerId =
                                      worker.id;
                                    localState.updateBobotForm.value = value;
                                    this.setState({
                                      updateBobotForm:
                                        localState.updateBobotForm
                                    });
                                  }}
                                />
                              </Form.Field>
                              <Button type="submit" primary size="tiny">
                                Submit
                              </Button>
                            </Form>
                          </Popup>
                        </div>
                        <div style={styles.inlineParent}>
                          {worker.Bobots.map(bobot => (
                            <span key={bobot.id}>
                              {this.findBobot(item, bobot)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </Table.Cell>
                  {/* <Table.Cell>
                  <div style={styles.inlineParent}>
                    <span style={styles.editDeleteItem}>
                      {(whoami ? whoami.name === item.createdBy : this.props.authReducer.userData.user.name === item.createdBy) && <Popup
                        size="mini"
                        trigger={<span><Icon name="edit" /></span>}
                        on="click"
                        position="bottom center"
                        onOpen={() => {
                          this.setState({
                            editItemName: { ...this.state.editItemName, itemId: item.id } });
                        }}
                        onClose={() => {
                          this.setState({ editItemName: { itemId: item.id, name: null } });
                        }}
                      >
                        <Form onSubmit={e => this.onSubmitEditItem(e, itemIdx)} style={{ width: '120px', textAlign: 'center' }}>
                          <Form.Field>
                            <Input
                              size="mini"
                              placeholder="edit nama item"
                              onChange={(e, { value }) => {
                                localState.editItemName.itemId = item.id;
                                localState.editItemName.name = value;
                                this.setState({ editItemName: localState.editItemName });
                              }}
                            />
                          </Form.Field>
                          <Button type="submit" primary size="tiny">Submit</Button>
                        </Form>
                      </Popup>}
                    </span>
                    {(whoami ? whoami.name === item.createdBy : this.props.authReducer.userData.user.name === item.createdBy) &&
                    <span
                      onClick={() =>
                        this.setState({
                          isDeleteModal: true,
                          deleteItemForm: {
                            itemId: item.id, itemIdx, name: item.name },
                        })}
                      style={styles.editDeleteItem}
                    >
                      <Icon name="trash" />
                    </span>}
                    {(whoami ? whoami.name === item.createdBy : this.props.authReducer.userData.user.name === item.createdBy) &&
                    <Popup
                      size="mini"
                      trigger={<span style={styles.editDeleteItem}><Icon name="sticky note outline" /></span>}
                      on="click"
                      position="bottom center"
                    >
                      <Form onSubmit={e => this.onSubmitEditUnitName(e)} style={{ width: '120px', textAlign: 'center' }}>
                        <Form.Field>
                          <Input
                            size="mini"
                            placeholder="edit nama satuan"
                            onChange={(e, { value }) => {
                              localState.unitNameForm.itemId = item.id;
                              localState.unitNameForm.name = value;
                              this.setState({ unitNameForm: localState.unitNameForm });
                            }}
                          />
                        </Form.Field>
                        <Button type="submit" primary size="tiny">Submit</Button>
                      </Form>
                    </Popup>}
                    {(whoami ? whoami.name === item.createdBy : this.props.authReducer.userData.user.name === item.createdBy) &&
                    <Popup
                      size="mini"
                      trigger={<span style={styles.editDeleteItem}><Icon name="book" /></span>}
                      on="click"
                      position="bottom center"
                    >
                      <Form onSubmit={e => this.onSubmitEditUnitName(e)} style={{ width: '120px', textAlign: 'center' }}>
                        <Form.Field>
                          <Input
                            size="mini"
                            placeholder="isi deskripsi baru"
                            onChange={(e, { value }) => {
                              localState.unitNameForm.itemId = item.id;
                              localState.unitNameForm.name = value;
                              this.setState({ unitNameForm: localState.unitNameForm });
                            }}
                          />
                        </Form.Field>
                        <Button type="submit" primary size="tiny">Submit</Button>
                      </Form>
                    </Popup>}
                  </div>
                </Table.Cell> */}
                  <Table.Cell>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="user" />
                          </span>
                        }
                        content={<div>pembuat item</div>}
                        position="top center"
                        size="mini"
                        wide="very"
                      />
                      <div>{item.createdBy}</div>
                    </div>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="calendar" />
                          </span>
                        }
                        content={<div>waktu dibuatnya item</div>}
                        position="top center"
                        size="mini"
                        wide="very"
                      />
                      <div>{helpers.processCreatedDate(item.createdAt)}</div>
                    </div>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="info circle" />
                          </span>
                        }
                        content={<div>nama satuan</div>}
                        position="top center"
                        size="mini"
                        wide="very"
                      />

                      <div>
                        <Popup
                          trigger={
                            <span style={styles.borderBottom}>
                              {item.Units[0].name
                                ? item.Units[0].name
                                : "belum ada"}
                            </span>
                          }
                          position="bottom center"
                          size="mini"
                          wide="very"
                          on="click"
                        >
                          <Form
                            onSubmit={e => this.onSubmitEditUnitName(e)}
                            style={{ width: "120px", textAlign: "center" }}
                          >
                            <Form.Field>
                              <Input
                                size="mini"
                                placeholder="edit nama satuan"
                                onChange={(e, { value }) => {
                                  localState.unitNameForm.itemId = item.id;
                                  localState.unitNameForm.name = value;
                                  this.setState({
                                    unitNameForm: localState.unitNameForm
                                  });
                                }}
                              />
                            </Form.Field>
                            <Button type="submit" primary size="tiny">
                              Submit
                            </Button>
                          </Form>
                        </Popup>
                      </div>
                    </div>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="hashtag" />
                          </span>
                        }
                        content={<div>nama kategori</div>}
                        position="top center"
                        size="mini"
                        wide="very"
                      />
                      <div>
                        <Popup
                          trigger={
                            <span style={styles.borderBottom}>
                              {item.Category ? item.Category.name : "belum ada"}
                            </span>
                          }
                          position="bottom center"
                          size="mini"
                          wide="very"
                          on="click"
                          onClose={() =>
                            this.setState({
                              isAddCategory: false,
                              isFetchCatLoading: false
                            })
                          }
                        >
                          <Form style={{ textAlign: "center" }}>
                            <Form.Field>
                              <Header style={{ fontSize: "1.2em" }}>
                                {item.Category
                                  ? "Edit kategori..."
                                  : "Tambah kategori..."}
                              </Header>
                              <Dropdown
                                size="mini"
                                selection
                                fluid
                                loading={
                                  !this.props.itemReducer.categories &&
                                  this.state.isFetchCatLoading
                                }
                                search
                                onFocus={() => {
                                  this.setState({
                                    isFetchCatLoading: true
                                  });
                                  this.props.getAllCategory(
                                    item.Category
                                      ? item.Category.name
                                      : item.Category
                                  );
                                }}
                                options={this.props.itemReducer.categories}
                                placeholder="pilih kategori"
                                onChange={(e, { value }) => {
                                  localState.assignCatForm.itemId = item.id;
                                  localState.assignCatForm.categoryId = value;
                                  this.setState({
                                    assignCatForm: localState.assignCatForm
                                  });
                                }}
                              />
                            </Form.Field>
                            <Button
                              onClick={() => this.onSubmitAssignCat()}
                              type="submit"
                              primary
                              size="tiny"
                            >
                              Submit
                            </Button>
                            <Divider />
                            <div>
                              <span
                                onClick={() =>
                                  this.setState({ isAddCategory: true })
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Icon name="plus" />
                                Buat kategori baru
                              </span>
                            </div>
                            {this.state.isAddCategory && (
                              <div style={{ paddingTop: "0.8em" }}>
                                <div style={{ padding: "0.58em" }}>
                                  <Input
                                    fluid
                                    size="tiny"
                                    placeholder="nama..."
                                    onChange={(e, { value }) => {
                                      localState.addCategoryForm.name = value;
                                      this.setState({
                                        addCategoryForm:
                                          localState.addCategoryForm
                                      });
                                    }}
                                  />
                                </div>
                                <Button
                                  onClick={() =>
                                    this.props.createNewCategory(
                                      this.state.addCategoryForm
                                    )
                                  }
                                  type="submit"
                                  primary
                                  size="tiny"
                                >
                                  Submit
                                </Button>
                              </div>
                            )}
                          </Form>
                        </Popup>
                      </div>
                    </div>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="book" />
                          </span>
                        }
                        content={
                          <div style={{ textAlign: "center" }}>
                            {item.description ? (
                              <div>
                                <Header style={{ fontSize: "1.2em" }}>
                                  Deskripsi Item
                                </Header>
                                <div
                                  style={{
                                    margin: "0 auto",
                                    width: "8.5em"
                                  }}
                                >
                                  <TextArea
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      textAlign: "center"
                                    }}
                                    value={item.description}
                                    autoHeight
                                    disabled
                                  />
                                </div>
                                <Divider />
                                <div>
                                  <span
                                    onClick={() =>
                                      this.setState({
                                        isEditDescription: true,
                                        tempDesc: {
                                          itemId: item.id,
                                          description: item.description
                                        }
                                      })
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Icon name="plus" />
                                    Edit Deskripsi...
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <Header style={{ fontSize: "1.2em" }}>
                                  Tambah deskripsi...
                                </Header>
                                <div
                                  style={{
                                    margin: "0 auto",
                                    width: "8.5em",
                                    paddingBottom: "0.5em"
                                  }}
                                >
                                  <TextArea
                                    style={{ width: "100%" }}
                                    size="tiny"
                                    autoHeight
                                    placeholder="deskripsi..."
                                    onChange={(e, { value }) => {
                                      localState.addDescForm.description = value;
                                      localState.addDescForm.itemId = item.id;
                                      this.setState({
                                        addDescForm: localState.addDescForm
                                      });
                                    }}
                                  />
                                </div>
                                <Button
                                  onClick={() =>
                                    this.props.addDescription(
                                      this.state.addDescForm
                                    )
                                  }
                                  type="submit"
                                  primary
                                  size="tiny"
                                >
                                  Submit
                                </Button>
                              </div>
                            )}
                            {this.state.isEditDescription && (
                              <div style={{ margin: "0 auto", width: "8.5em" }}>
                                <TextArea
                                  style={{ width: "100%" }}
                                  autoHeight
                                  value={this.state.tempDesc.description}
                                  onChange={(e, { value }) => {
                                    localState.tempDesc.description = value;
                                    localState.tempDesc.itemId = item.id;
                                    this.setState({
                                      tempDesc: localState.tempDesc
                                    });
                                  }}
                                />
                                <Button
                                  onClick={() =>
                                    this.props.addDescription(
                                      this.state.tempDesc
                                    )
                                  }
                                  type="submit"
                                  primary
                                  size="tiny"
                                >
                                  Edit
                                </Button>
                              </div>
                            )}
                          </div>
                        }
                        position="bottom center"
                        size="mini"
                        wide="very"
                        on="click"
                        onClose={() =>
                          this.setState({ isEditDescription: false })
                        }
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          )}
          {/* di bawah ini list hasil filter */}
          {this.props.itemReducer.isFilterByNameTriggered && (
            <Table.Body>
              {this.props.itemReducer.items.map((item, itemIdx) => (
                <Table.Row key={item.name}>
                  <Table.Cell>
                    <Popup
                      trigger={
                        <div style={styles.popupParent}>
                          <span style={styles.itemName}>{item.name}</span>
                        </div>
                      }
                      on="click"
                      flowing
                      size="mini"
                      wide
                      position="left center"
                      onOpen={() => {
                        this.props.getWorkerThatHasNoItemYetForDelegateLogic(
                          item.id
                        );
                        const tempState = { ...this.state };
                        this.setState({
                          delegateItemForm: {
                            itemId: item.id,
                            workerId: tempState.delegateItemForm.workerId
                          }
                        });
                      }}
                    >
                      <Form
                        style={styles.centerPos}
                        onSubmit={e => this.onSubmitDelegateForm(e)}
                      >
                        {this.renderDropdownOptions()}
                      </Form>
                      {/* <Button size="tiny" icon="info" content="Detail" /> */}
                    </Popup>

                    <div style={styles.inlineParent}>
                      <span style={styles.editDeleteItem}>
                        {(whoami
                          ? whoami.name === item.createdBy
                          : this.props.authReducer.userData.user.name ===
                            item.createdBy) && (
                          <Popup
                            size="mini"
                            trigger={
                              <span style={styles.borderBottom}>Edit Nama</span>
                            }
                            on="click"
                            position="bottom center"
                            onOpen={() => {
                              this.setState({
                                editItemName: {
                                  ...this.state.editItemName,
                                  itemId: item.id
                                }
                              });
                            }}
                            onClose={() => {
                              this.setState({
                                editItemName: {
                                  itemId: item.id,
                                  name: null
                                }
                              });
                            }}
                          >
                            <Form
                              onSubmit={e => this.onSubmitEditItem(e, itemIdx)}
                              style={{
                                width: "120px",
                                textAlign: "center"
                              }}
                            >
                              <Form.Field>
                                <Input
                                  size="mini"
                                  placeholder="masukan nama baru"
                                  onChange={(e, { value }) => {
                                    localState.editItemName.itemId = item.id;
                                    localState.editItemName.name = value;
                                    this.setState({
                                      editItemName: localState.editItemName
                                    });
                                  }}
                                />
                              </Form.Field>
                              <Button type="submit" primary size="tiny">
                                Submit
                              </Button>
                            </Form>
                          </Popup>
                        )}
                      </span>
                      <br />
                      {(whoami
                        ? whoami.name === item.createdBy
                        : this.props.authReducer.userData.user.name ===
                          item.createdBy) && (
                        <span
                          onClick={() =>
                            this.setState({
                              isDeleteModal: true,
                              deleteItemForm: {
                                itemId: item.id,
                                itemIdx,
                                name: item.name
                              }
                            })
                          }
                          style={styles.borderBottom}
                        >
                          Hapus
                        </span>
                      )}
                    </div>
                    {/* <div>
                    <Popup
                      trigger={<span style={styles.itemInfo}><Icon name="info circle" />{item.Units[0].name ? item.Units[0].name : ''}</span>}
                      content="nilai satuan"
                      position="bottom center"
                      size="mini"
                      wide="very"
                    />
                  </div> */}
                    {/* <div>
                    <Popup
                      trigger={<span style={styles.itemInfo}><Icon name="hashtag" />{item.Category ? item.Category.name : '-'}</span>}
                      content="nama kategori"
                      position="bottom center"
                      size="mini"
                      wide="very"
                    />
                  </div> */}
                    {/* <div>
                    <Popup
                      trigger={<span style={styles.itemInfo}>deskripsi</span>}
                      content={<span>{item.description ? item.description : '-'}</span>}
                      position="bottom center"
                      size="mini"
                      wide="very"
                      on="click"
                    />
                  </div> */}
                  </Table.Cell>
                  {/* <Table.Cell>
                  {this.renderPopupForCategory(item)}
                </Table.Cell> */}
                  {/* <Table.Cell>
                  <Popup
                    trigger={<div style={styles.popupParent}>
                      {<span style={styles.borderBottom}>
                        {item.description ? item.description : 'tidak ada deskripsi'}
                      </span>}
                    </div>}
                    on="click"
                    size="mini"
                    position="top center"
                  >
                    <Form style={{ width: '90px', textAlign: 'center' }}>
                      <Form.Field>
                        <TextArea
                          placeholder="Isi deskripsinya.."
                          autoHeight
                        />
                      </Form.Field>
                      <Form.Field>
                        <Button size="tiny" primary type="submit">Submit</Button>
                      </Form.Field>
                    </Form>
                  </Popup>
                </Table.Cell> */}
                  <Table.Cell>
                    {item.Targets.map((target, targetIdx) => (
                      <div key={target.id}>
                        <Popup
                          position="top center"
                          trigger={
                            <div style={styles.popupParent}>
                              {
                                <span style={styles.borderBottom}>
                                  {helpers.processMonthName(target.period)}
                                </span>
                              }
                            </div>
                          }
                          on="click"
                          size="mini"
                          wide
                          onOpen={() =>
                            this.setState({
                              addTargetForm: {
                                itemId: item.id,
                                base: null,
                                stretch: null,
                                period: target.period
                              }
                            })
                          }
                          onClose={() => this.props.removeMsgFromAddTarget()}
                        >
                          <Form
                            onSubmit={e =>
                              this.onSubmitTargetForm(
                                e,
                                itemIdx,
                                targetIdx,
                                target.period
                              )
                            }
                            style={{ width: "90px", textAlign: "center" }}
                          >
                            <Form.Field>
                              <Input
                                // required
                                labelPosition="left"
                                size="mini"
                                placeholder="base"
                                iconPosition="left"
                                onChange={(e, { value }) => {
                                  const cleanValue = value
                                    .replace(/[,]+/g, ".")
                                    .trim();
                                  localState.addTargetForm.base = cleanValue;
                                  e.target.value = cleanValue;
                                  localState.addTargetForm.itemId = item.id;
                                  localState.addTargetForm.period =
                                    target.period;
                                  this.setState({
                                    addTargetForm: localState.addTargetForm
                                  });
                                  this.setState({
                                    addTargetForm: {
                                      ...localState.addTargetForm,
                                      stretch: localState.addTargetForm.stretch
                                        ? localState.addTargetForm.stretch
                                        : target.stretch
                                    }
                                  });
                                  if (value === "") {
                                    this.setState({
                                      addTargetForm: {
                                        ...localState.addTargetForm,
                                        base: null,
                                        stretch: null
                                      }
                                    });
                                  }
                                }}
                              >
                                <input />
                                <Icon
                                  name="circle"
                                  style={styles.successIcon}
                                />
                              </Input>
                            </Form.Field>
                            <Form.Field>
                              <Input
                                // required
                                labelPosition="left"
                                size="mini"
                                placeholder="stretch"
                                iconPosition="left"
                                onChange={(e, { value }) => {
                                  const cleanValue = value
                                    .replace(/[,]+/g, ".")
                                    .trim();
                                  localState.addTargetForm.stretch = cleanValue;
                                  e.target.value = cleanValue;
                                  localState.addTargetForm.itemId = item.id;
                                  localState.addTargetForm.period =
                                    target.period;
                                  this.setState({
                                    addTargetForm: localState.addTargetForm
                                  });
                                  this.setState({
                                    addTargetForm: {
                                      ...localState.addTargetForm,
                                      base: localState.addTargetForm.base
                                        ? localState.addTargetForm.base
                                        : target.base
                                    }
                                  });
                                  if (value === "") {
                                    this.setState({
                                      addTargetForm: {
                                        ...localState.addTargetForm,
                                        stretch: null,
                                        base: null
                                      }
                                    });
                                  }
                                }}
                              >
                                <input />
                                <Icon name="star" style={styles.starIcon} />
                              </Input>
                            </Form.Field>
                            <Button size="tiny" primary type="submit">
                              Submit
                            </Button>
                          </Form>
                        </Popup>
                        <div style={styles.inlineParent}>
                          <span>
                            <Icon name="circle" style={styles.successIcon} />
                            {target.base ? target.base : 0}
                          </span>
                          <span>
                            <Icon name="star" style={styles.starIcon} />
                            {target.stretch ? target.stretch : 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    {item.Progresses.map((progress, progressIdx) => (
                      <div key={progress.id}>
                        <Popup
                          position="top center"
                          trigger={
                            <div style={styles.popupParent}>
                              {
                                <span style={styles.borderBottom}>
                                  {helpers.processMonthName(progress.period)}
                                </span>
                              }
                            </div>
                          }
                          on="click"
                          size="mini"
                          wide
                          onOpen={() =>
                            this.setState({
                              addProgressForm: {
                                itemId: item.id,
                                value: null,
                                period: progress.period
                              }
                            })
                          }
                        >
                          <Form
                            onSubmit={e =>
                              this.onSubmitProgressForm(e, {
                                itemIdx,
                                progressIdx
                              })
                            }
                            style={{ width: "110px", textAlign: "center" }}
                          >
                            <Form.Field>
                              <Input
                                labelPosition="left"
                                size="mini"
                                placeholder="nilai progress"
                                iconPosition="left"
                                onChange={(e, { value }) => {
                                  const cleanValue = value
                                    .replace(/[,]+/g, ".")
                                    .trim();
                                  localState.addProgressForm.value = cleanValue;
                                  e.target.value = cleanValue;
                                  localState.addProgressForm.itemId = item.id;
                                  localState.addProgressForm.period =
                                    progress.period;
                                  localState.addProgressForm.value = cleanValue;
                                  this.setState({
                                    addProgressForm: localState.addProgressForm
                                  });
                                }}
                              >
                                <input />
                                <Icon name="line chart" />
                              </Input>
                            </Form.Field>
                            <Button size="tiny" primary type="submit">
                              Submit
                            </Button>
                          </Form>
                        </Popup>
                        <div style={styles.inlineParent}>
                          <span>{progress.value ? progress.value : 0}</span>
                        </div>
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell style={styles.paddingCell}>
                    {/* <Table.Cell> */}
                    {item.Statuses.map(status => (
                      <div style={styles.itemProperties} key={status.id}>
                        <div>
                          {helpers.processMonthName(status.period)}
                          {processDot(status.stats)}
                        </div>
                        <div style={styles.inlineParent}>
                          <span>
                            {status.value
                              ? `${numeral(status.value).format("0.0")} %`
                              : "0 %"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell style={styles.paddingCell}>
                    {item.Workers.map(worker => (
                      <div style={styles.itemProperties} key={worker.id}>
                        <Popup
                          trigger={
                            <div style={styles.popupParent}>
                              <span style={styles.borderBottom}>
                                {worker.name}
                              </span>
                            </div>
                          }
                          on="click"
                          position="top center"
                          size="tiny"
                          onOpen={() =>
                            this.getPerformances(item.id, worker.id)
                          }
                          wide="very"
                        >
                          {worker.Performances &&
                            sortPerformance(worker.Performances)}
                          {worker.Performances &&
                            worker.Performances.map(performance => (
                              <div
                                key={performance.id}
                                style={styles.centerPos}
                              >
                                <span>
                                  <strong>
                                    {this.filterPerformanceMonth(
                                      performance,
                                      item.id
                                    )}
                                  </strong>
                                </span>
                                <br />
                                <span>
                                  {this.filterPerformanceValue(
                                    performance,
                                    item.id
                                  )}
                                </span>
                              </div>
                            ))}
                          {worker.Performances &&
                            worker.Performances.length < 1 && (
                              <div>Isi progress dulu</div>
                            )}
                          {!worker.Performances && <div>Loading...</div>}
                        </Popup>
                      </div>
                    ))}
                  </Table.Cell>
                  <Table.Cell>
                    {item.Workers.map(worker => (
                      <div style={styles.itemProperties} key={worker.id}>
                        <div>
                          <Popup
                            trigger={
                              <span style={styles.borderBottom}>
                                {worker.name}
                              </span>
                            }
                            on="click"
                            position="right center"
                          >
                            <Form
                              onSubmit={e => this.onSubmitEditBobot(e)}
                              style={{
                                width: "120px",
                                textAlign: "center"
                              }}
                            >
                              <Form.Field>
                                <Input
                                  size="mini"
                                  placeholder="masukan nilai bobot"
                                  onChange={(e, { value }) => {
                                    localState.updateBobotForm.itemId = item.id;
                                    localState.updateBobotForm.workerId =
                                      worker.id;
                                    localState.updateBobotForm.value = value;
                                    this.setState({
                                      updateBobotForm:
                                        localState.updateBobotForm
                                    });
                                  }}
                                />
                              </Form.Field>
                              <Button type="submit" primary size="tiny">
                                Submit
                              </Button>
                            </Form>
                          </Popup>
                        </div>
                        <div style={styles.inlineParent}>
                          {worker.Bobots.map(bobot => (
                            <span key={bobot.id}>
                              {this.findBobot(item, bobot)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </Table.Cell>
                  {/* <Table.Cell>
                  <div style={styles.inlineParent}>
                    <span style={styles.editDeleteItem}>
                      {(whoami ? whoami.name === item.createdBy : this.props.authReducer.userData.user.name === item.createdBy) && <Popup
                        size="mini"
                        trigger={<span><Icon name="edit" /></span>}
                        on="click"
                        position="bottom center"
                        onOpen={() => {
                          this.setState({
                            editItemName: { ...this.state.editItemName, itemId: item.id } });
                        }}
                        onClose={() => {
                          this.setState({ editItemName: { itemId: item.id, name: null } });
                        }}
                      >
                        <Form onSubmit={e => this.onSubmitEditItem(e, itemIdx)} style={{ width: '120px', textAlign: 'center' }}>
                          <Form.Field>
                            <Input
                              size="mini"
                              placeholder="edit nama item"
                              onChange={(e, { value }) => {
                                localState.editItemName.itemId = item.id;
                                localState.editItemName.name = value;
                                this.setState({ editItemName: localState.editItemName });
                              }}
                            />
                          </Form.Field>
                          <Button type="submit" primary size="tiny">Submit</Button>
                        </Form>
                      </Popup>}
                    </span>
                    {(whoami ? whoami.name === item.createdBy : this.props.authReducer.userData.user.name === item.createdBy) &&
                    <span
                      onClick={() =>
                        this.setState({
                          isDeleteModal: true,
                          deleteItemForm: {
                            itemId: item.id, itemIdx, name: item.name },
                        })}
                      style={styles.editDeleteItem}
                    >
                      <Icon name="trash" />
                    </span>}
                    {(whoami ? whoami.name === item.createdBy : this.props.authReducer.userData.user.name === item.createdBy) &&
                    <Popup
                      size="mini"
                      trigger={<span style={styles.editDeleteItem}><Icon name="sticky note outline" /></span>}
                      on="click"
                      position="bottom center"
                    >
                      <Form onSubmit={e => this.onSubmitEditUnitName(e)} style={{ width: '120px', textAlign: 'center' }}>
                        <Form.Field>
                          <Input
                            size="mini"
                            placeholder="edit nama satuan"
                            onChange={(e, { value }) => {
                              localState.unitNameForm.itemId = item.id;
                              localState.unitNameForm.name = value;
                              this.setState({ unitNameForm: localState.unitNameForm });
                            }}
                          />
                        </Form.Field>
                        <Button type="submit" primary size="tiny">Submit</Button>
                      </Form>
                    </Popup>}
                    {(whoami ? whoami.name === item.createdBy : this.props.authReducer.userData.user.name === item.createdBy) &&
                    <Popup
                      size="mini"
                      trigger={<span style={styles.editDeleteItem}><Icon name="book" /></span>}
                      on="click"
                      position="bottom center"
                    >
                      <Form onSubmit={e => this.onSubmitEditUnitName(e)} style={{ width: '120px', textAlign: 'center' }}>
                        <Form.Field>
                          <Input
                            size="mini"
                            placeholder="isi deskripsi baru"
                            onChange={(e, { value }) => {
                              localState.unitNameForm.itemId = item.id;
                              localState.unitNameForm.name = value;
                              this.setState({ unitNameForm: localState.unitNameForm });
                            }}
                          />
                        </Form.Field>
                        <Button type="submit" primary size="tiny">Submit</Button>
                      </Form>
                    </Popup>}
                  </div>
                </Table.Cell> */}
                  <Table.Cell>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="user" />
                          </span>
                        }
                        content={<div>pembuat item</div>}
                        position="top center"
                        size="mini"
                        wide="very"
                      />
                      <div>{item.createdBy}</div>
                    </div>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="calendar" />
                          </span>
                        }
                        content={<div>waktu dibuatnya item</div>}
                        position="top center"
                        size="mini"
                        wide="very"
                      />
                      <div>{helpers.processCreatedDate(item.createdAt)}</div>
                    </div>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="info circle" />
                          </span>
                        }
                        content={<div>nama satuan</div>}
                        position="top center"
                        size="mini"
                        wide="very"
                      />

                      <div>
                        <Popup
                          trigger={
                            <span style={styles.borderBottom}>
                              {item.Units[0].name
                                ? item.Units[0].name
                                : "belum ada"}
                            </span>
                          }
                          position="bottom center"
                          size="mini"
                          wide="very"
                          on="click"
                        >
                          <Form
                            onSubmit={e => this.onSubmitEditUnitName(e)}
                            style={{ width: "120px", textAlign: "center" }}
                          >
                            <Form.Field>
                              <Input
                                size="mini"
                                placeholder="edit nama satuan"
                                onChange={(e, { value }) => {
                                  localState.unitNameForm.itemId = item.id;
                                  localState.unitNameForm.name = value;
                                  this.setState({
                                    unitNameForm: localState.unitNameForm
                                  });
                                }}
                              />
                            </Form.Field>
                            <Button type="submit" primary size="tiny">
                              Submit
                            </Button>
                          </Form>
                        </Popup>
                      </div>
                    </div>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="hashtag" />
                          </span>
                        }
                        content={<div>nama kategori</div>}
                        position="top center"
                        size="mini"
                        wide="very"
                      />
                      <div>
                        <Popup
                          trigger={
                            <span style={styles.borderBottom}>
                              {item.Category ? item.Category.name : "belum ada"}
                            </span>
                          }
                          position="bottom center"
                          size="mini"
                          wide="very"
                          on="click"
                          onClose={() =>
                            this.setState({
                              isAddCategory: false,
                              isFetchCatLoading: false
                            })
                          }
                        >
                          <Form style={{ textAlign: "center" }}>
                            <Form.Field>
                              <Header style={{ fontSize: "1.2em" }}>
                                {item.Category
                                  ? "Edit kategori..."
                                  : "Tambah kategori..."}
                              </Header>
                              <Dropdown
                                size="mini"
                                selection
                                fluid
                                loading={
                                  !this.props.itemReducer.categories &&
                                  this.state.isFetchCatLoading
                                }
                                search
                                onFocus={() => {
                                  this.setState({
                                    isFetchCatLoading: true
                                  });
                                  this.props.getAllCategory(
                                    item.Category
                                      ? item.Category.name
                                      : item.Category
                                  );
                                }}
                                options={this.props.itemReducer.categories}
                                placeholder="pilih kategori"
                                onChange={(e, { value }) => {
                                  localState.assignCatForm.itemId = item.id;
                                  localState.assignCatForm.categoryId = value;
                                  this.setState({
                                    assignCatForm: localState.assignCatForm
                                  });
                                }}
                              />
                            </Form.Field>
                            <Button
                              onClick={() => this.onSubmitAssignCat()}
                              type="submit"
                              primary
                              size="tiny"
                            >
                              Submit
                            </Button>
                            <Divider />
                            <div>
                              <span
                                onClick={() =>
                                  this.setState({ isAddCategory: true })
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Icon name="plus" />
                                Buat kategori baru
                              </span>
                            </div>
                            {this.state.isAddCategory && (
                              <div style={{ paddingTop: "0.8em" }}>
                                <div style={{ padding: "0.58em" }}>
                                  <Input
                                    fluid
                                    size="tiny"
                                    placeholder="nama..."
                                    onChange={(e, { value }) => {
                                      localState.addCategoryForm.name = value;
                                      this.setState({
                                        addCategoryForm:
                                          localState.addCategoryForm
                                      });
                                    }}
                                  />
                                </div>
                                <Button
                                  onClick={() =>
                                    this.props.createNewCategory(
                                      this.state.addCategoryForm
                                    )
                                  }
                                  type="submit"
                                  primary
                                  size="tiny"
                                >
                                  Submit
                                </Button>
                              </div>
                            )}
                          </Form>
                        </Popup>
                      </div>
                    </div>
                    <div style={styles.itemInfoPosition}>
                      <Popup
                        trigger={
                          <span style={styles.itemInfo}>
                            <Icon name="book" />
                          </span>
                        }
                        content={
                          <div style={{ textAlign: "center" }}>
                            {item.description ? (
                              <div>
                                <Header style={{ fontSize: "1.2em" }}>
                                  Deskripsi Item
                                </Header>
                                <div
                                  style={{
                                    margin: "0 auto",
                                    width: "8.5em"
                                  }}
                                >
                                  <TextArea
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      textAlign: "center"
                                    }}
                                    value={item.description}
                                    autoHeight
                                    disabled
                                  />
                                </div>
                                <Divider />
                                <div>
                                  <span
                                    onClick={() =>
                                      this.setState({
                                        isEditDescription: true,
                                        tempDesc: {
                                          itemId: item.id,
                                          description: item.description
                                        }
                                      })
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Icon name="plus" />
                                    Edit Deskripsi...
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <Header style={{ fontSize: "1.2em" }}>
                                  Tambah deskripsi...
                                </Header>
                                <div
                                  style={{
                                    margin: "0 auto",
                                    width: "8.5em",
                                    paddingBottom: "0.5em"
                                  }}
                                >
                                  <TextArea
                                    style={{ width: "100%" }}
                                    size="tiny"
                                    autoHeight
                                    placeholder="deskripsi..."
                                    onChange={(e, { value }) => {
                                      localState.addDescForm.description = value;
                                      localState.addDescForm.itemId = item.id;
                                      this.setState({
                                        addDescForm: localState.addDescForm
                                      });
                                    }}
                                  />
                                </div>
                                <Button
                                  onClick={() =>
                                    this.props.addDescription(
                                      this.state.addDescForm
                                    )
                                  }
                                  type="submit"
                                  primary
                                  size="tiny"
                                >
                                  Submit
                                </Button>
                              </div>
                            )}
                            {this.state.isEditDescription && (
                              <div style={{ margin: "0 auto", width: "8.5em" }}>
                                <TextArea
                                  style={{ width: "100%" }}
                                  autoHeight
                                  value={this.state.tempDesc.description}
                                  onChange={(e, { value }) => {
                                    localState.tempDesc.description = value;
                                    localState.tempDesc.itemId = item.id;
                                    this.setState({
                                      tempDesc: localState.tempDesc
                                    });
                                  }}
                                />
                                <Button
                                  onClick={() =>
                                    this.props.addDescription(
                                      this.state.tempDesc
                                    )
                                  }
                                  type="submit"
                                  primary
                                  size="tiny"
                                >
                                  Edit
                                </Button>
                              </div>
                            )}
                          </div>
                        }
                        position="bottom center"
                        size="mini"
                        wide="very"
                        on="click"
                        onClose={() =>
                          this.setState({ isEditDescription: false })
                        }
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          )}
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authReducer: state.authReducer,
  itemReducer: state.itemReducer,
  msgReducer: state.msgReducer,
  workerReducer: state.workerReducer,
  categoryReducer: state.categoryReducer,
  filterItemReducer: state.filterItemReducer
});

const mapDispatchToProps = dispatch => ({
  getItems: () => {
    dispatch(getItems());
  },
  closeAddItemSuccessMsg: () => {
    dispatch(closeAddItemSuccessMsg());
  },
  getWorkerThatHasNoItemYetForDelegateLogic: itemId => {
    dispatch(getWorkerThatHasNoItemYetForDelegateLogic(itemId));
  },
  delegateItem: (itemId, workerId) => {
    dispatch(delegateItem(itemId, workerId));
  },
  // closeSuccessMsgInDelegatingItem: () => {
  //   dispatch(closeSuccessMsgInDelegatingItem());
  // },
  // closeErrMsgInDelegatingItem: () => {
  //   dispatch(closeErrMsgInDelegatingItem());
  // },
  getWorkersWithoutAdminForFilterInTableItem: () => {
    dispatch(getWorkersWithoutAdminForFilterInTableItem());
  },
  getCategoriesForFilteringItem: () => {
    dispatch(getCategoriesForFilteringItem());
  },
  // filterItemByItsMakerAndCategory: properties => {
  //   dispatch(filterItemByItsMakerAndCategory(properties));
  // },
  // turnOffFilterByItsMakerAndCategory: properties => {
  //   dispatch(turnOffFilterByItsMakerAndCategory(properties));
  // },
  addItemBaseAndStretchInTarget: (
    targetFormProperties,
    itemIdx,
    targetIdx,
    period
  ) => {
    dispatch(
      addItemBaseAndStretchInTarget(
        targetFormProperties,
        itemIdx,
        targetIdx,
        period
      )
    );
  },
  removeMsgFromAddTarget: () => {
    dispatch(removeMsgFromAddTarget());
  },
  addValueInProgressItem: (progressFomProperties, positionData) => {
    dispatch(addValueInProgressItem(progressFomProperties, positionData));
  },
  getTargetsFromFirebase: () => {
    dispatch(getTargetsFromFirebase());
  },
  getProgressesFromFirebase: () => {
    dispatch(getProgressesFromFirebase());
  },
  getAddItemFromFirebase: () => {
    dispatch(getAddItemFromFirebase());
  },
  editItemName: (itemId, name, itemIdx) => {
    dispatch(editItemName(itemId, name, itemIdx));
  },
  getEditItemFromFirebase: () => {
    dispatch(getEditItemFromFirebase());
  },
  updateUnitName: unitData => {
    dispatch(updateUnitName(unitData));
  },
  getPerformancesByItemAndWorker: (itemId, workerId) => {
    dispatch(getPerformancesByItemAndWorker(itemId, workerId));
  },
  updateBobotValue: bobotData => {
    dispatch(updateBobotValue(bobotData));
  },
  getAllCategory: chosenCat => {
    dispatch(getAllCategory(chosenCat));
  },
  createNewCategory: categoryName => {
    dispatch(createNewCategory(categoryName));
  },
  assignCatToItem: assignCatForm => {
    dispatch(assignCatToItem(assignCatForm));
  },
  addDescription: addDescForm => {
    dispatch(addDescription(addDescForm));
  },
  filterItemByName: properties => {
    dispatch(filterItemByName(properties));
  },
  turnOffFilterByName: () => {
    dispatch(turnOffFilterByName());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);
