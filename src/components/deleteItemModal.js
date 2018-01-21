import React, { Component } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
  deleteItem,
} from '../actions';

class DeleteItemModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Modal
        size="tiny"
        dimmer="blurring"
        open={this.props.isDeleteModal}
      >
        <Modal.Header>Konfirmasi</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>{`Apa Anda yakin mau menghapus item ${this.props.deleteForm.name}?`}</Header>
            <p>Semua data akan hilang dan tidak bisa dikembalikan</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="black"
            onClick={() => this.props.state.setState({
              isDeleteModal: false,
            })}
          >
            Tidak Jadi
          </Button>
          <Button
            negative
            icon="trash"
            labelPosition="left"
            content="Hapus"
            onClick={() => {
              this.props.deleteItem(this.props.deleteForm.itemId, this.props.deleteForm.itemIdx);
              this.props.state.setState({
                isDeleteModal: false,
              });
            }}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  deleteItem: (itemId, itemIdx) => {
    dispatch(deleteItem(itemId, itemIdx));
  },
});

export default connect(null, mapDispatchToProps)(DeleteItemModal);
