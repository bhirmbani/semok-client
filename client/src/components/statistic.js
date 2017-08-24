import React, { Component } from 'react';
import { Card, Table, Header, Dropdown, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { statisticDropdownStyles as styles } from '../helpers/styles';

import {
  getItemWithIdAndName,
  getItemWithTargets,
  getTargetsFromFirebase,
  getProgressesFromFirebase,
  getItems,
} from '../actions';

class Statistic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lookForTargetsItemForm: {
        itemId: null,
      },
    };
  }

  componentDidMount() {
    if (!this.props.itemReducer.itemWithIdAndName) {
      this.props.getItemWithIdAndName();
      this.props.getItems();
    }
    this.props.getTargetsFromFirebase();
    this.props.getProgressesFromFirebase();
  }

  getItemName() {
    if (this.props.itemReducer.itemWithIdAndName) {
      const itemName = this.props.itemReducer.itemWithIdAndName.filter(
        item => item.value === this.state.lookForTargetsItemForm.itemId);
      return itemName[0] ? itemName[0].text : '';
    }
  }

  processMonthName(period) {
    switch (period) {
      case '1':
        return 'Januari';
      case '2':
        return 'Februari';
      case '3':
        return 'Maret';
      case '4':
        return 'April';
      case '5':
        return 'Mei';
      case '6':
        return 'Juni';
      case '7':
        return 'Juli';
      case '8':
        return 'Agustus';
      case '9':
        return 'September';
      case '10':
        return 'Oktober';
      case '11':
        return 'November';
      case '12':
        return 'Desember';
      default:
        return '';
    }
  }

  render() {
    const localState = this.state;
    return (
      <div>
        <div style={styles.searchItemDropdown}>
         Tampilkan statistik item dengan nama
          <Dropdown
            style={styles.searchItemInput}
            placeholder="cari item KPI"
            scrolling
            search
            // selection
            // openOnFocus={false}
            // selectOnBlur={false}
            inline
            fluid
            noResultsMessage="tidak ada item"
            options={this.props.itemReducer.itemWithIdAndName}
            onChange={(e, { value }) => {
              const tempState = localState.lookForTargetsItemForm;
              tempState.itemId = value;
              const itemIdInThisScope = value;
              this.setState({
                ...this.state,
                lookForTargetsItemForm: {
                  itemId: value,
                },
              });
              this.props.getItemWithTargets(itemIdInThisScope);
            }}
          />
        </div>
        <Header textAlign="center" size="huge" content={this.getItemName()} />
        {(this.props.itemReducer.itemWithTargets &&
                this.state.lookForTargetsItemForm.itemId) &&
                <Grid columns={4}>
                  <Grid.Row>
                    <Grid.Column>
                      {this.props.itemReducer.itemWithTargets.Targets.map(target => (
                        <Table textAlign="center" key={target.id} celled striped padded="very">
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                            Target
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                {this.processMonthName(target.period)}
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell>Base</Table.HeaderCell>
                              <Table.HeaderCell>Stretch</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell>{target.base ? target.base : 0}</Table.Cell>
                              <Table.Cell>{target.stretch ? target.stretch : 0}</Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>))}
                    </Grid.Column>
                    <Grid.Column>
                      {this.props.itemReducer.itemWithTargets.Progresses.map(progress => (
                        <Table textAlign="center" key={progress.id} celled striped padded="very">
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                Progress
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                {this.processMonthName(progress.period)}
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell>Value</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell>{progress.value ? progress.value : 0}</Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      ))}
                    </Grid.Column>
                    <Grid.Column>
                      {this.props.itemReducer.itemWithTargets.Statuses.map(status => (
                        <Table textAlign="center" key={status.id} celled striped padded="very">
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                Deviation
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                {this.processMonthName(status.period)}
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell>Value</Table.HeaderCell>
                              <Table.HeaderCell>Status</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell>{status.value ? `${numeral(status.value).format('0.0')} %` : '0 %'}</Table.Cell>
                              <Table.Cell>{status.stats ? status.stats : 0}</Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      ))}
                    </Grid.Column>
                    <Grid.Column>
                      {this.props.itemReducer.itemWithTargets.Performances.map(performance => (
                        <Table textAlign="center" key={performance.id} celled striped padded="very">
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                Performance
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                {this.processMonthName(performance.period)}
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell>Value</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell>{performance.value ? `${numeral(performance.value).format('0.0')} %` : '0 %'}</Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      ))}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  itemReducer: state.itemReducer,
});

const mapDispatchToProps = dispatch => ({
  getItemWithIdAndName: () => {
    dispatch(getItemWithIdAndName());
  },
  getItemWithTargets: (itemId) => {
    dispatch(getItemWithTargets(itemId));
  },
  getTargetsFromFirebase: (itemId) => {
    dispatch(getTargetsFromFirebase(itemId));
  },
  getProgressesFromFirebase: (itemId) => {
    dispatch(getProgressesFromFirebase(itemId));
  },
  getItems: () => {
    dispatch(getItems());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistic);
