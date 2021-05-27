import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import {store,persistor} from './store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
  ,
  document.getElementById('root')
);

