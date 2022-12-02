import logo from './logo.svg';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';

function App() {

  const [data, setData] = useState(null);

  return (
    <div className="App">
     <HomePage />
    </div>
  );
}

export default App;
