import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Slider from './Slider'
import banner1 from './assets/banner1.png'
import banner2 from './assets/banner2.png'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="content">
          <div className="banner">
            <Slider>
              <img src={banner1} alt="banner1" />
              <img src={banner2} alt="banner2" />
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
