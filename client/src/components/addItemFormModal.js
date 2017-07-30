import React, { Component } from 'react';
import { Button, Header, Icon, Modal, Form, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { addItem, closeAddItemFormModal, openModal } from '../actions';
import ErrMsgInAddItemForm from './errMsgInAddItemForm';

const styles = {
  btnPosition: {
    marginBottom: '20px',
  },
};

class AddItemFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        name: '',
        description: '',
        freq: '',
        value: '',
      },
      isModalOpened: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  onClickAdd(e) {
    e.preventDefault();
    this.props.addItem(this.state.form)
    this.closeModalIfItemAddedSuccessfully();
  }

  validate(value) {
    const number = new RegExp('^(?=.*[0-9])');
    return number.test(value);
  }

  closeModalIfItemAddedSuccessfully() {
    if (this.props.msgReducer.addItem.msg.context === 'Terimakasih') {
      this.setState({ isModalOpened: false });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { form } = this.state;

    const tmpForm = {
      ...form,
    };

    tmpForm[name] = value;

    this.setState({
      form: tmpForm,
    });
  }

  render() {
    console.log(this.validate(this.state.form.value));
    const { form } = this.state;
    const msg = <ErrMsgInAddItemForm />;
    return (
      <div>
        <Modal
          trigger={<Button secondary onClick={() => { this.props.openModal(); this.setState({ isModalOpened: true, form: { name: '', description: '', freq: '', value: '' } }); }}>
            <Icon name="plus" />Tambah Item Baru</Button>}
          closeIcon="close"
          size="small"
          closeOnDimmerClick={false}
          open={this.props.msgReducer.addItem.msg.isModalOpened}
          onClose={() => { this.props.closeAddItemFormModal(); this.setState({ isModalOpened: false, form: { name: '', description: '', freq: '', value: '' } }); }}
        >
          <Header icon="plus" content="Tambah Item KPI" />
          <Modal.Content>
            <Form onSubmit={e => this.onClickAdd(e)}>
              {msg}
              <Form.Field>
                <label>Nama Item</label>
                <input
                  placeholder="nama item KPI"
                  name="name"
                  type="text"
                  onChange={this.handleChange}
                  required
                />
              </Form.Field>
              <Form.Field>
                <label>Deskripsi</label>
                <input
                  placeholder="deskripsi item (opsional)"
                  name="description"
                  type="text"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Frekuensi</label>
                <Dropdown
                  placeholder="pilih frekuensi pelaporan progress item"
                  fluid
                  selection
                  name="freq"
                  onChange={(e, { value }) => { const tempState = { ...form }; tempState.freq = value; this.setState({ form: tempState }); }}
                  options={[
                    { text: 'setiap bulan', value: '1' },
                    { text: 'setiap triwulan', value: '3' },
                    { text: 'setahun sekali', value: '12' },
                  ]}
                />
              </Form.Field>
              <Form.Field>
                <label>Bobot</label>
                <input
                  placeholder="bobot untuk item ini (dalam persen)"
                  name="value"
                  type="text"
                  onChange={this.handleChange}
                  required
                />
              </Form.Field>

              <Button
                color="blue"
                floated="right"
                style={styles.btnPosition}
              >
                <Icon name="plus" />
              Tambah
              </Button>

            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  msgReducer: state.msgReducer,
});

const mapDispatchToProps = dispatch => ({
  addItem: (data) => {
    dispatch(addItem(data));
  },
  closeAddItemFormModal: () => {
    dispatch(closeAddItemFormModal());
  },
  openModal: () => {
    dispatch(openModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddItemFormModal);
