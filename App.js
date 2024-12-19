//Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React from 'react';

import { default as theme } from './theme.json';
import { default as mapping } from './mapping.json';
import * as Font from 'expo-font';

import user from './reducers/user'

import NewChargeScreen from './screens/NewChargeScreen';
import UpdateChargeScreen from './screens/UpdateChargeScreen';
import UpdateAccountScreen from './screens/UpdateAccountScreen';
import NewAccountScreen from './screens/NewAccountScreen';
import CalendarScreen from './screens/CalendarScreen';
import ListScreen from './screens/ListScreen';
import ParametresScreen from './screens/ParametresScreen';
import RapportScreen from './screens/RapportScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import PasswordUpdate from './screens/PasswordUpdate';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Icon, IconRegistry, BottomNavigation, BottomNavigationTab, Layout } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useState, useEffect } from "react";

import NotificationsHandler from './NotificationsHandler'; // Import des notifications


const store = configureStore({
  reducer: { user }
})
// Définition des icônes
const CalendarIcon = (props) => <Icon {...props} name="calendar-outline" />;
const ListIcon = (props) => <Icon {...props} name="list-outline" />;
const ReportIcon = (props) => <Icon {...props} name="bar-chart-outline" />;
const SettingsIcon = (props) => <Icon {...props} name="settings-outline" />;

// création des navigateurs 
const {Navigator, Screen} = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// onglets personnalisés
const BottomTabBar =({navigation, state}) =>(
  <BottomNavigation 
  selectedIndex={state.index}
  onSelect={(index)=> navigation.navigate(state.routeNames[index])}
  style={{ backgroundColor: '#ffffff' }}>
   <BottomNavigationTab title="Calendrier" icon={CalendarIcon}/>
    <BottomNavigationTab title="Liste" icon={ListIcon}/>
    <BottomNavigationTab title="Rapport" icon={ReportIcon}/>
    <BottomNavigationTab title="Paramètres"icon={SettingsIcon} />
  </BottomNavigation>
)

// Navigation par onglets
const TabNavigator = () => (

  <Navigator tabBar={(props) => <BottomTabBar {...props}/>} screenOptions={{ headerShown: false }}>
    <Screen name="Calendrier" component={CalendarScreen} />
    <Screen name="Liste" component={ListScreen} />
    <Screen name="Rapport" component={RapportScreen} />
    <Screen name="Paramètres" component={ParametresScreen} />
  </Navigator>
);


export default function App() {
  
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Ubuntu-Regular': require('./assets/fonts/Ubuntu-Regular.ttf'),
      'Ubuntu-Bold': require('./assets/fonts/Ubuntu-Bold.ttf'),
      
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null; // Vous pouvez ajouter un écran de chargement ici
  }
  return (
    <>
    
    <IconRegistry icons={EvaIconsPack} />
    
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }} customMapping={mapping}>
      <Provider store={store}>
      <NotificationsHandler />
        <NavigationContainer > 

          <Stack.Navigator screenOptions={{ headerShown: false }} >
          
           <Stack.Screen name="LoginScreen" component={LoginScreen} />
           <Stack.Screen name="SignInScreen" component={SignInScreen} />
           <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="NewCharge" component={NewChargeScreen} />
            <Stack.Screen name="UpdateCharge" component={UpdateChargeScreen} />
            <Stack.Screen name="NewAccount" component={NewAccountScreen} />
            <Stack.Screen name="UpdateAccount" component={UpdateAccountScreen} />
            <Stack.Screen name="PasswordUpdate" component={PasswordUpdate} />
          </Stack.Navigator>

        </NavigationContainer>
       
      </Provider>

    </ApplicationProvider>
    
</>

  )
}

