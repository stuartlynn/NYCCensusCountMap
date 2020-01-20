import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import MainPage from './pages/MainPage';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" component={MainPage} />
      </Router>
    </div>
  );
}

export default App;
