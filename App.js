import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
//Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//FontAwesome
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//KITTEN UI
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { default as theme } from './theme.json'; // <-- Import app theme
import { default as mapping } from './mapping.json'; // <-- Import app mapping


//Screens
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import ChargesScreen from './screens/ChargesScreen';
import ParametresScreen from './screens/ParametresScreen';
import RapportScreen from './screens/RapportScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({route}) => ({
      tabBarIcon:({color, size}) => {
        let iconName= "";

        if (route.name === "Calendar"){
          iconName= "calendar"
        } if (route.name === "Charges"){
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
      <Tab.Screen name="Charges" component={ChargesScreen}/>
      <Tab.Screen name="Rapport" component={RapportScreen}/>
      <Tab.Screen name="Paramètres" component={ParametresScreen}/>
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>

    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}} >
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="TabNavigator" component={TabNavigator}/>
    </Stack.Navigator>
  </NavigationContainer>
  </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
