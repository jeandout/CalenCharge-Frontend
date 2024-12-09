import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import NewAccountScreen from './screens/NewAccountScreen';
import CalendarScreen from './screens/CalendarScreen';
import ListScreen from './screens/ListScreen';
import ParametresScreen from './screens/ParametresScreen';
import RapportScreen from './screens/RapportScreen';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import user from './reducers/user'
import NewChargeScreen from './screens/NewChargeScreen';

const store = configureStore({
  reducer:{user}
})


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//CHanger FontAwesome par Eva Icons

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({route}) => ({
      tabBarIcon:({color, size}) => {
        let iconName= "";

        if (route.name === "Calendar"){
          iconName= "calendar"
        } if (route.name === "List"){
          iconName= "dollar";
        }if (route.name === "Rapport"){
          iconName= "bar-chart";
        } else if (route.name === "Paramètres"){
          iconName= "cogs";
        }
        
        return <FontAwesome name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor:"#ec6e5b",
      tabBarInactiveTintColor: "#335561",
      headerShown: false,
    })}> 
      <Tab.Screen name="Calendar" component={CalendarScreen}/>
      <Tab.Screen name="List" component={ListScreen}/>
      <Tab.Screen name="Rapport" component={RapportScreen}/>
      <Tab.Screen name="Paramètres" component={ParametresScreen}/>
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
       <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}} >
      <Stack.Screen name="NewAccount" component={NewAccountScreen}/>
      <Stack.Screen name="NewCharge" component={NewChargeScreen}/>
      <Stack.Screen name="TabNavigator" component={TabNavigator}/>
    </Stack.Navigator>
  </NavigationContainer>
    </Provider>
   
  );
}


