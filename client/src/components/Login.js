import React, { Component } from 'react';
import { Button, Header, Icon, Modal, Form, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { login, openWelcome } from '../actions';

const styles = {
  btnPosition: {
    marginBottom: '20px',
  },
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: '',
        password: '',
      },
      isModalOpened: false,
      isMsgVisible: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  onSignIn(e) {
    e.preventDefault();
    this.setState({
      isMsgVisible: true,
    });
    this.props.login(this.state.form);
    this.props.openWelcome();
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
    const isLoginClicked = this.props.authReducer.userData.ok;
    let msg = null;
    if (isLoginClicked === false) {
      msg = (<Message
        header={this.props.authReducer.userData.msg.context}
        content={this.props.authReducer.userData.msg.content}
        negative
        icon="remove circle"
      />);
    } else if (isLoginClicked === true) {
      msg = (<Message
        header={this.props.authReducer.userData.msg.context}
        content={`${this.props.authReducer.userData.msg.content}, ${this.props.authReducer.userData.user.name}`}
        positive
        icon="info"
      />);
    }
    return (
      <div>
        <Modal
          trigger={<Button primary onClick={() => this.setState({ isModalOpened: true })}>
            <Icon name="sign in" />Login</Button>}
          closeIcon="close"
          size="small"
          closeOnDimmerClick={false}
          open={this.state.isModalOpened}
          onClose={() => this.setState({ isModalOpened: false })}
        >
          <Header icon="sign in" content="Login" />
          <Modal.Content>
            <Form onSubmit={e => this.onSignIn(e)}>
              {msg}
              <Form.Field>
                <label>Email</label>
                <input
                  placeholder="johndoe@mail.com"
                  name="email"
                  type="email"
                  onChange={this.handleChange}
                  required
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input
                  placeholder="Password"
                  name="password"
                  type="password"
                  onChange={this.handleChange}
                  required
                />
              </Form.Field>
              <Button
                color="blue"
                floated="right"
                style={styles.btnPosition}
              >
                <Icon name="sign in" />
              Submit
              </Button>

            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authReducer: state.authReducer,
});

const mapDispatchToProps = dispatch => ({
  login: (data) => {
    dispatch(login(data));
  },
  openWelcome: () => {
    dispatch(openWelcome());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
