import { LogBox, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

import { StackNavigation, AppNavigation } from './src/navigation/AppNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { Provider, useDispatch } from 'react-redux'
import { persistor, store } from './src/redux/store'
import Toast from 'react-native-toast-message';
import { fetchCurrencies, fetchSettings } from './src/redux/reducers/Settings'

import FlashMessage from "react-native-flash-message";
import Orientation from 'react-native-orientation-locker'
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { PersistGate } from 'redux-persist/integration/react'


LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications



const Bootstrap = () => {
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(fetchSettings())
    dispatch(fetchCurrencies())
  }, [dispatch])
  return null
}



const App = () => {

  useEffect(() => {
    Orientation.lockToPortrait();

    SystemNavigationBar.navigationHide();
  }, []);
  
  return (
    <Provider  store={store}>
      <PersistGate loading={null} persistor={persistor}>

      <NavigationContainer
      onStateChange={() => {
          SystemNavigationBar.navigationHide();
        }}
      >
        <Bootstrap />
        <StackNavigation />
        <FlashMessage position="top" />
      </NavigationContainer>
      </PersistGate>

    </Provider>

  )
}

export default App

const styles = StyleSheet.create({})