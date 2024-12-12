import {
    View, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform
  } from "react-native";
  import React from 'react';
  import { Calendar, Text, Icon } from '@ui-kitten/components';
  import { useState } from "react";
  import SelectAccount from "../components/SelectAccount";
  import { useSelector } from 'react-redux';
  import Charge from "../components/Charge";
  import Ionicons from '@expo/vector-icons/Ionicons';
  import MonthOccurrenceGenerator from "../components/MonthOccurrenceGenerator";
  
  
  
  const backIcon = ({ name = 'arrow-ios-back-outline', ...props }) => (
    <Icon
      {...props}
      name={name}
      fill={'white'}
    />
  );
  
  
  //  changer icon
  const LeftArrow = (arrowProps) => {
    return (
      <TouchableOpacity
        style={styles.arrow}
        onPress={arrowProps.onPress}
      >
        <Ionicons name="chevron-back-outline" size={24} color='blue' />
        {/* {backIcon({})} */}
      </TouchableOpacity>
    );
  };
  
  // Change icon 
  const RightArrow = (arrowProps) => {
    return (
      <TouchableOpacity
        style={styles.arrow}
        onPress={arrowProps.onPress}
      >
        <Ionicons name="chevron-forward" size={24} color="blue" />
      </TouchableOpacity>
    );
  }
  
  export default function CalendarScreen({ navigation }) {
  
    const accounts = useSelector((state) => state.user.value.user.accounts);
    const selectedAccount = useSelector((state) => state.user.value.selectedAccount);
  
    const charges = accounts[selectedAccount].charges?.map((charge, i) => {
      return <Charge key={i} amount={charge.amount} date={charge.date} priority={charge.priority} />
    })
  
    const [date, setDate] = useState(null);
  
    const InfoDay = (date) => {
      const day = new Date(date.date).getDate();
      return (
        <View>
          <Text >
            {day}
          </Text>
          <Text style={styles.cell}>
          {charges[0]}
          </Text>
        </View>
      );
    };
  
  
  
    return (
      <View style={styles.container}>
  
        <View style={styles.select}>
          <SelectAccount />
        </View>
        <Calendar
          date={date}
          onSelect={(nextDate) => setDate(nextDate)}
          renderDay={InfoDay}
          //renderMonth={InfoDay}
          renderArrowLeft={LeftArrow}
          renderArrowRight={RightArrow}
        />
      </View>
  
    )
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      gap: 15,
      padding: 15,
      marginTop: 50,
    },
    select: {
      gap: 15,
      marginBottom: 20,
    },
    icon: {
      width: 32,
      height: 32,
    },
    cell: {
      fontSize: 10,
    },
  })