import { createStore, applyMiddleware } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";
import { combineReducers } from "redux";
import favoriteSlice from './reducers/AddFavorite';
import CartProduct from './reducers/CartProduct';
import StoreAddress from './reducers/StoreAddress';
import Currency from './reducers/Currency';
import languageSlice from './reducers/Language';
import Home from './reducers/Home';
import Auth, { clearSession } from './reducers/Auth';
import Products from './reducers/Products';
import Orders from './reducers/Orders';
import Payments from './reducers/Payments';
import Influencer from './reducers/Influencer';
import Reels from './reducers/Reels';
import Content from './reducers/Content';
import Settings from './reducers/Settings';
import Checkout from './reducers/Checkout';
import storiesReducer from './reducers/Stories';
import SettingsSlicer from './reducers/SettingsSlicer';
import notificationSlice from './reducers/notificationSlice';
import { configureApiClient } from '../api/client';

// Persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  //   whitelist: [ "auth","cartProducts",'addresses','favorite','mapData','similarProductsSlice'],
  whitelist: ['favorite', 'cart', 'address', 'currency', 'language', 'auth', 'products','notificationSlice', 'stories', 'heroText','language'],
  blacklist: ['networkError'], // Don't persist network error state
};

const rootReducer = combineReducers({
  favorite: favoriteSlice,
  cart: CartProduct,
  address: StoreAddress,
  currency: Currency,
  language: languageSlice,
  home: Home,
  stories: storiesReducer,
  auth: Auth,
  products: Products,
  orders: Orders,
  payments: Payments,
  influencer: Influencer,
  reels: Reels,
  content: Content,
  settings: Settings,
  checkout: Checkout,
  heroText: SettingsSlicer,
  notificationSlice: notificationSlice,
})

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with enhancers
const store = createStore(persistedReducer, applyMiddleware(thunk));

// Create the persistor
const persistor = persistStore(store);

configureApiClient({
  getToken: () => store.getState()?.auth?.token || null,
  onUnauthorized: () => store.dispatch(clearSession()),
});

export { store, persistor };