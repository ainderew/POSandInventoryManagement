import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainContainer from './main-container';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MainContainer />
  </React.StrictMode>
);


