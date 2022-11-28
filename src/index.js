import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import './index.css';
import 'antd/dist/antd.css';
import App from './components/App';
import filterSliceReducer from './redux/filterSlice';
import ticketsSlice from './redux/ticketsSlice';

const rootReducer = combineReducers({
  filters: filterSliceReducer,
  tickets: ticketsSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
