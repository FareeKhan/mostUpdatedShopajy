import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AccountScreen from '../screens/AccountScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import MyCartScreen from '../screens/MyCartScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import ShamCashScreen from '../screens/ShamCashScreen';
import CashOnDeliveryScreen from '../screens/CashOnDeliveryScreen';
import ApplePayScreen from '../screens/ApplePayScreen';
import CardPaymentScreen from '../screens/CardPaymentScreen';
import ShamCashPaymentVerification from '../screens/ShamCashPaymentVerification';
import AddNewCardScreen from '../screens/AddNewCardScreen';
import BottomTabNavigation from './BottomTabNavigation'
import MyOrdersScreen from '../screens/MyOrdersScreen';
import PaymentAddress from '../screens/PaymentAddress';
import SettingScreen from '../screens/SettingScreen';
import SystemPermission from '../screens/SystemPermission';
import TermsAndCondition from '../screens/TermsAndCondition';
import AboutApp from '../screens/AboutApp';
import HelpAndSupport from '../screens/HelpAndSupport';
import ReferalLinkScreen from '../screens/ReferalLinkScreen';
import EarningHistory from '../screens/EarningHistory';
import AddNewAddressScreen from '../screens/AddNewAddressScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import AddNewDebitCard from '../screens/AddNewDebitCard';
import EditProfileScreen from '../screens/EditProfileScreen';
import ReelsScreen from '../screens/ReelsScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import OTPScreen from '../screens/OTPScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import InfluencerRegisterationScreen from '../screens/InfluencerRegisterationScreen';

import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer'
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import AllCategoriesScreen from '../screens/AllCategoriesScreen';


const Stack = createNativeStackNavigator();

export const StackNavigation = () => {
  const language = useSelector(state => state.language.language);
  const onBoard = useSelector(state => state.language.onBoard);
    const token = useSelector(s => s?.auth?.token)

    // console.log('shodsdwmeotlanguagelanguageen',token)




  useEffect(() => {
    if (language) {
      i18next.changeLanguage(language);
    }
  }, [language]);
  return (
    <Stack.Navigator initialRouteName={onBoard ? 'OnBoardingScreen' : 'DrawerNavigation'} screenOptions={{ headerShown: false }}>


      {
        onBoard ?
          <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
          :
          <>

            <Stack.Screen
              name="DrawerNavigation"
              component={DrawerNavigation}
            />
            {/* Auth Stack */}
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Stack.Screen name="CreateAccountScreen" component={CreateAccountScreen} />
            <Stack.Screen name="OTPScreen" component={OTPScreen} />
            <Stack.Screen name="PasswordResetScreen" component={PasswordResetScreen} />
            <Stack.Screen name="InfluencerRegisterationScreen" component={InfluencerRegisterationScreen} />

            <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />

            <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
            <Stack.Screen name="MyCartScreen" component={MyCartScreen} />
            <Stack.Screen name="PaymentMethodScreen" component={PaymentMethodScreen} />
            <Stack.Screen name="ShamCashScreen" component={ShamCashScreen} />
            <Stack.Screen name="CashOnDeliveryScreen" component={CashOnDeliveryScreen} />
            <Stack.Screen name="ApplePayScreen" component={ApplePayScreen} />
            <Stack.Screen name="CardPaymentScreen" component={CardPaymentScreen} />
            <Stack.Screen name="ShamCashPaymentVerification" component={ShamCashPaymentVerification} />
            <Stack.Screen name="AddNewCardScreen" component={AddNewCardScreen} />
            <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
            <Stack.Screen name="PaymentAddress" component={PaymentAddress} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />

            <Stack.Screen name="SystemPermission" component={SystemPermission} />
            <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />

            <Stack.Screen name="AboutApp" component={AboutApp} />
            <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />

            <Stack.Screen name="ReferalLinkScreen" component={ReferalLinkScreen} />
            <Stack.Screen name="EarningHistory" component={EarningHistory} />
            <Stack.Screen name="AddNewAddressScreen" component={AddNewAddressScreen} />
            <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
            <Stack.Screen name="AddNewDebitCard" component={AddNewDebitCard} />

            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
            <Stack.Screen name="ReelsScreen" component={ReelsScreen} />
            <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
            <Stack.Screen name="AllCategoriesScreen" component={AllCategoriesScreen} />


          </>

      }





    </Stack.Navigator>
  )
}

const Drawer = createDrawerNavigator();

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  )
}





