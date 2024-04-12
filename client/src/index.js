import 'bootstrap/dist/css/bootstrap.min.css';
import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from "./store/UserStore";

export const Context = createContext(null);

const userStore = new UserStore();

ReactDOM.render(
  <Context.Provider value={{ user: userStore }}>
    <App />
  </Context.Provider>,
  document.getElementById('root')
);
