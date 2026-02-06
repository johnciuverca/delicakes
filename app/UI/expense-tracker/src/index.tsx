import React from 'react';
import ReactDOM from 'react-dom/client';
import MainContainer from './components/MainContainer';
import './style.css';

const App = () => {
      return <MainContainer />;
}

const domRoot = document.getElementById('root') as HTMLElement;
if (!domRoot) {
      throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(domRoot);
root.render(<App />);