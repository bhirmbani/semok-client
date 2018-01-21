import React, { Component } from "react";
import { connect } from "react-redux";
import { Dropdown, Table, Dimmer, Loader, Header, Icon } from "semantic-ui-react";

import { getMyItems } from "../actions";
import helpers from "../helpers";

import { itemTableStyles as styles } from "../helpers/styles";

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

const whoami = helpers.decode(localStorage.getItem("token"));

class ItemSaya extends Component {
  componentDidMount() {
    if (!this.props.itemReducer.myItems) {
      this.props.getmyItems(whoami.id);
    }
  }

  render() {
    if (!this.props.itemReducer.myItems) {
      return (
        <div>
          <Dimmer active inverted>
            <Loader size="massive">Mengambil Item Saya...</Loader>
          </Dimmer>
        </div>
      );
    } else if (this.props.itemReducer.myItems.length < 1) {
      return <div>Anda belum punya item</div>;
    }
    return (
      <div>
        <Header size="huge">Dashboard</Header>
        <Header size="medium">Item Milik {whoami.name}</Header>
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Item KPI</Table.HeaderCell>
              <Table.HeaderCell>Bobot</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Progress</Table.HeaderCell>
              <Table.HeaderCell>Deviation</Table.HeaderCell>
              <Table.HeaderCell>Shared With</Table.HeaderCell>
              <Table.HeaderCell>Target</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {/* di bawah ini list semua item */}
          <Table.Body>
            {this.props.itemReducer.myItems.map((item, itemIdx) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{`${item.Bobots[0].value} %`}</Table.Cell>
                <Table.Cell>
                  <div style={styles.textEllipsis}>{item.description}</div>
                </Table.Cell>
                <Table.Cell>
                  {item.Progresses.map(progress => (
                    <div key={progress.id}>
                      <div style={styles.inlineParent}>
                        <span style={styles.borderBottom}>
                          {`${helpers.processMonthName(progress.period)} `}
                        </span>
                        <span>{progress.value ? progress.value : 0}</span>
                      </div>
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell>
                  {item.Statuses.map(status => (
                    <div style={{ textAlign: 'center' }} key={status.id}>
                      <span>
                        {processDot(status.stats)}
                      </span>
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell>
                  {item.Workers.map(worker => (
                    <div style={{ textAlign: 'center' }} key={worker.id}>
                      <div style={styles.inlineParent}>
                        {worker.name}
                      </div>
                    </div>
                  ))}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
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
});

const mapDispatchToProps = dispatch => ({
  getmyItems: (workerId) => {
    dispatch(getMyItems(workerId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemSaya);
