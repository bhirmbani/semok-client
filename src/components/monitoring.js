import React, { Component } from 'react';
import { Table, Segment, Loader, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import helpers from '../helpers';
import { itemTableStyles as styles } from '../helpers/styles';

import {
  getItems,
  getTargetsFromFirebase,
  getProgressesFromFirebase,
  getAddItemFromFirebase,
  getEditItemFromFirebase,
} from '../actions';

const processDot = (status) => {
  let style = null;

  const processDotStyle = (stats) => {
    if (stats === 'red') {
      style = {
        fontSize: '0.70em',
        padding: '0.6em',
        color: '#FF2C2C', // FF4545
        // cursor: 'pointer',
      };
    } else if (stats === 'green') {
      style = {
        fontSize: '0.70em',
        padding: '0.6em',
        color: '#58E481',
        // cursor: 'pointer',
      };
    } else if (stats === 'star') {
      style = {
        fontSize: '0.70em',
        padding: '0.6em',
        color: '#FFD480', // FBE6A2 F6C90E FAF15D
        // cursor: 'pointer',
      };
    } else {
      style = {
        fontSize: '0.70em',
        padding: '0.6em',
        color: 'black',
        // cursor: 'pointer',
      };
    }
    return style;
  };

  switch (status) {
    case 'red':
      return (
        <Icon style={processDotStyle(status)} name="circle" />
      );
    case 'green':
      return (
        <Icon style={processDotStyle(status)} name="circle" />
      );
    case 'star':
      return (
        <Icon style={processDotStyle(status)} name="star" />
      );
    default:
      return (
        <Icon style={processDotStyle(status)} name="circle" />
      );
  }
};

class Monitoring extends Component {
  componentDidMount() {
    if (!this.props.itemReducer.items) {
      this.props.getItems();
    }
    this.props.getTargetsFromFirebase();
    this.props.getProgressesFromFirebase();
    this.props.getAddItemFromFirebase();
    this.props.getEditItemFromFirebase();
  }

  componentDidUpdate() {
    if (this.props.msgReducer.addTarget.msg.isSuccessMsgShowed) {
      toast.success(this.props.msgReducer.addTarget.msg.content);
    } else if (this.props.msgReducer.addTarget.msg.isErrMsgShowed) {
      toast.error(this.props.msgReducer.addTarget.msg.content);
    } else if (this.props.msgReducer.addProgress.msg.isSuccessMsgShowed) {
      toast.success(this.props.msgReducer.addProgress.msg.content);
    } else if (this.props.msgReducer.addProgress.msg.isErrMsgShowed) {
      toast.error(this.props.msgReducer.addProgress.msg.content);
    } else if (this.props.msgReducer.addItem.msg.isSuccessMsgShowed) {
      toast.success(this.props.msgReducer.addItem.msg.content);
    } else if (this.props.msgReducer.editItemName.msg.isSuccessMsgShowed) {
      toast.success(this.props.msgReducer.editItemName.msg.content);
    }
  }

  render() {
    return (
      <div>
        {(this.props.itemReducer.items) ? <Table textAlign="center" celled striped compact="very" padded="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Target</Table.HeaderCell>
              <Table.HeaderCell>Progress <Icon name="line chart" style={styles.titleIcon} /> </Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.itemReducer.items.map((item, itemIdx) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  {item.name}
                </Table.Cell>
                <Table.Cell>
                  {item.Targets.map((target, targetIdx) => (
                    <div key={target.id}>
                      <div style={styles.inlineParent}>
                        {helpers.processMonthName(target.period)}
                        <span>
                          <Icon name="circle" style={styles.successIcon} />
                          {target.base ? ` ${target.base}` : ` ${0}`}
                        </span>
                        <span><Icon name="star" style={styles.starIcon} />
                          {target.stretch ? ` ${target.stretch}` : ` ${0}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell>
                  {item.Progresses.map((progress, progressIdx) => (
                    <div key={progress.id}>
                      <div style={styles.inlineParent}>
                        {helpers.processMonthName(progress.period)}
                        <span>
                          {` ${progress.value}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell>
                  {item.Statuses.map((status, statusIdx) => (
                    <div key={status.id}>
                      <div style={styles.inlineParent}>
                        {helpers.processMonthName(status.period)}
                        <span>
                          {processDot(status.stats)}
                        </span>
                      </div>
                    </div>
                  ))}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table> : <Loader active inline="centered" />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  itemReducer: state.itemReducer,
  msgReducer: state.msgReducer,
});

const mapDispatchToProps = dispatch => ({
  getItems: () => {
    dispatch(getItems());
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
  getEditItemFromFirebase: () => {
    dispatch(getEditItemFromFirebase());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);
