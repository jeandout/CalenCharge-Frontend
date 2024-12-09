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
import { ApplicationProvider, Layout, IconRegistry, } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import user from './reducers/user'
import NewChargeScreen from './screens/NewChargeScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const store = configureStore({
  reducer: { user }
})





const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//CHanger FontAwesome par Eva Icons

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = "";

        if (route.name === "Calendrier") {
          iconName = "calendar"
        } if (route.name === "Liste") {
          iconName = "dollar";
        } if (route.name === "Rapport") {
          iconName = "bar-chart";
        } else if (route.name === "Paramètres") {
          iconName = "cogs";
        }

        return <FontAwesome name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: "#ec6e5b",
      tabBarInactiveTintColor: "#335561",
      headerShown: false,
    })}>
      <Tab.Screen name="Calendrier" component={CalendarScreen} />
      <Tab.Screen name="Liste" component={ListScreen} />
      <Tab.Screen name="Rapport" component={RapportScreen} />
      <Tab.Screen name="Paramètres" component={ParametresScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <Provider store={store}>
        <SafeAreaView style={{flex:1}}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="NewCharge" component={NewChargeScreen} />
            <Stack.Screen name="NewAccount" component={NewAccountScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </ApplicationProvider>
</>

  );
}


