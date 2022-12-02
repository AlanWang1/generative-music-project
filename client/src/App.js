import logo from './logo.svg';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';

function App() {

  const [data, setData] = useState(null);

  return (
    <div className="App">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css" />
     <HomePage />
    </div>
  );
}

export default App;
