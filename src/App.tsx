import './App.css';
import Main from './components/TS/Main';
import Navbar from './components/TS/Navbar';
import Home from './components/TS/Home';
import React, { useState, useEffect } from 'react';

function App() {
  const [input, setInput] = useState(
    sessionStorage.getItem('input') ? sessionStorage.getItem('input') : ''
  );

  useEffect(() => {
    if (sessionStorage.getItem('input')) {
      setInput(sessionStorage.getItem('input'));
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem('input', input);
  }, [input]);

  return (
    <div className="App">
      <Navbar setInput={setInput} />
      <div className="sections">
        {input ? (
          <Main input={input} />
        ) : (
          <Home setInput={setInput} />
        )}
      </div>
    </div>
  );
}

export default App;
