import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
//Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//FontAwesome
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//KITTEN UI
import React from 'react';


import { default as theme } from './theme.json'; // <-- Import app theme
import { default as mapping } from './mapping.json'; // <-- Import app mapping

import NewAccountScreen from './screens/NewAccountScreen';
import CalendarScreen from './screens/CalendarScreen';
import ListScreen from './screens/ListScreen';
import ParametresScreen from './screens/ParametresScreen';
import RapportScreen from './screens/RapportScreen';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, IconRegistry, BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import user from './reducers/user'
import NewChargeScreen from './screens/NewChargeScreen';
import { Icon } from '@ui-kitten/components';

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
  onSelect={(index)=> navigation.navigate(state.routeNames[index])}>
   <BottomNavigationTab title="Calendrier" icon={CalendarIcon}/>
    <BottomNavigationTab title="Liste" icon={ListIcon}/>
    <BottomNavigationTab title="Rapport" icon={ReportIcon}/>
    <BottomNavigationTab title="Paramètres"icon={SettingsIcon} />
  </BottomNavigation>
)
//CHanger FontAwesome par Eva Icons

// Navigation par onglets
const TabNavigator = () => (

  <Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Screen name="Calendrier" component={CalendarScreen} />
    <Screen name="Liste" component={ListScreen} />
    <Screen name="Rapport" component={RapportScreen} />
    <Screen name="Paramètres" component={ParametresScreen} />
  </Navigator>
);


export default function App() {
  return (
    <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <Provider store={store}>
        <NavigationContainer> // 
          <Stack.Navigator screenOptions={{ headerShown: false }} >
           <Stack.Screen name="NewAccount" component={NewAccountScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="NewCharge" component={NewChargeScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ApplicationProvider>
</>

  );
}


