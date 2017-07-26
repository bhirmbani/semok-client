import React, { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';

import TableItem from './components/table-item';
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
          <TableItem />
        </Container>
      </div>
    );
  }
}

export default App;
