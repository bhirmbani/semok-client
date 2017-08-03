import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Sidebar from './components/sidebar';

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
      <BrowserRouter>
        <div style={styles.position}>
          <Navbar />
          <div style={styles.spacer}>
          &nbsp;
          </div>
          <Container>
            <Route path="/" component={Sidebar} />
          </Container>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
