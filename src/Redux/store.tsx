import { createStore, applyMiddleware, combineReducers } from 'redux';
import reducer from './UserReducer';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage,
};

const combinedReducers = combineReducers({
  user: reducer
});

const persistedReducer = persistReducer(persistConfig, combinedReducers);

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
// const store = configureStore({
//   reducer: persistedReducer,
//   devTools: true,
//   middleware: [thunk]
// });

const persistor = persistStore(store);

export { store, persistor };