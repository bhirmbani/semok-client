import React, { Component } from 'react';
import { Button, Header, Icon, Modal, Form, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { userTryingToLogin } from '../actions';
// openWelcomeMsgIfUserSuccessfullyLogin
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

  onClickSignIn(e) {
    e.preventDefault();
    this.props.userTryingToLogin(this.state.form);
    // this.props.openWelcomeMsgIfUserSuccessfullyLogin()
    this.setState({
      isMsgVisible: true,
    }); // ganti jadi ke redux bukan local state
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
    const isLoginSuccess = this.props.authReducer.userData.ok;
    let msg = null;
    if (isLoginSuccess === false) {
      msg = (<Message
        header={this.props.authReducer.userData.msg.context}
        content={this.props.authReducer.userData.msg.content}
        negative
        icon="remove circle"
      />);
    }
    // else if (isLoginSuccess === true) {
    //   msg = (<Message
    //     header={this.props.authReducer.userData.msg.context}
    //     content={`${this.props.authReducer.userData.msg.content}, ${this.props.authReducer.userData.user.name}`}
    //     positive
    //     icon="info"
    //   />);
    // }
    return (
      <div>
        <Modal
          trigger={<Button primary onClick={() => this.setState({ isModalOpened: true })}>
            <Icon name="sign in" />Masuk</Button>}
          closeIcon="close"
          size="small"
          closeOnDimmerClick={false}
          open={this.state.isModalOpened}
          onClose={() => this.setState({ isModalOpened: false, form: { email: '', password: '' } })}
        >
          <Header icon="sign in" content="Masuk" />
          <Modal.Content>
            <Form onSubmit={e => this.onClickSignIn(e)}>
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
                <Icon name="checkmark" />
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
  msgReducer: state.msgReducer,
});

const mapDispatchToProps = dispatch => ({
  userTryingToLogin: (data) => {
    dispatch(userTryingToLogin(data));
  },
  // openWelcomeMsgIfUserSuccessfullyLogin: () => {
  //   dispatch(openWelcomeMsgIfUserSuccessfullyLogin());
  // },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
