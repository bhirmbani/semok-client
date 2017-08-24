import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import { statisticDropdownStyles as styles } from '../helpers/styles';

class ItemSaya extends Component {
  render() {
    return (
      <div>
        <div style={styles.searchItemDropdown}>
         Tampilkan item milik pekerja
          <Dropdown
            style={styles.searchItemInput}
            placeholder="Pilih pekerja"
            scrolling
            search
            // selection
            // openOnFocus={false}
            // selectOnBlur={false}
            inline
            fluid
            noResultsMessage="tidak ada item"
            options={this.props.itemReducer.itemWithIdAndName}
            // onChange={(e, { value }) => {
            //   const tempState = localState.lookForTargetsItemForm;
            //   tempState.itemId = value;
            //   const itemIdInThisScope = value;
            //   this.setState({
            //     ...this.state,
            //     lookForTargetsItemForm: {
            //       itemId: value,
            //     },
            //   });
            //   this.props.getItemWithTargets(itemIdInThisScope);
            // }}
          />
        </div>
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

export default connect(mapStateToProps, null)(ItemSaya);
