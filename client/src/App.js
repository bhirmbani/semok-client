import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import MsgAtTheBottomOfNavbar from './components/msgAtTheBottomOfNavbar';
import Navbar from './components/navbar';

const styles = {
  position: {
    height: '100vh',
  },
  spacer: {
    width: '100%',
    height: '80px',
  },
};

class App extends Component {
  render() {
    return (
      <div style={styles.position}>
        <Navbar />
        <div style={styles.spacer}>
          &nbsp;
        </div>
        <Container>
          <MsgAtTheBottomOfNavbar />
        </Container>
      </div>
    );
  }
}

export default App;
