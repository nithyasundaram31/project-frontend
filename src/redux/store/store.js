// // store.js
// import { createStore, applyMiddleware } from 'redux';
// import { thunk } from 'redux-thunk';
// import rootReducer from '../reducers/rootReducer'; // rootReducer

// const store = createStore(rootReducer, applyMiddleware(thunk));

// // Check localStorage for user data and initialize state
// const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
// if (user) {
//   store.dispatch({ type: 'LOGIN_SUCCESS', payload: user });
// }

// export default store;

// src/redux/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../reducers/authReducer' // Example: auth slice
import examReducer from '../reducers/examReducer' // Example: exam slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
  },
  // thunk default-ஆ இருக்குது, extra settings வேணாம
})

export default store;
