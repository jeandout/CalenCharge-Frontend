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
import MonthOccurrenceGenerator from "../components/MonthOccurrenceGenerator";



const backIcon = ({ name, ...props }) => (
  <Icon
    {...props}
    name='arrow-ios-back-outline'
    fill={'#55AD9B'}
  />
);
const nextIcon = ({ name, ...props }) => (
  <Icon
    {...props}
    name='arrow-ios-forward-outline'
    fill={'#55AD9B'}
  />
);

const LeftArrow = (arrowProps) => {
  return (
    <TouchableOpacity
      style={styles.arrow}
      onPress={arrowProps.onPress}>
      {backIcon({})}
    </TouchableOpacity>
  );
};

const RightArrow = (arrowProps) => {
  return (
    <TouchableOpacity
      style={styles.arrow}
      onPress={arrowProps.onPress}>
      {nextIcon({})}
    </TouchableOpacity>
  );
}

export default function CalendarScreen({ navigation }) {

  const accounts = useSelector((state) => state.user.value.user.accounts);
  const selectedAccount = useSelector((state) => state.user.value.selectedAccount);

  const charges = accounts[selectedAccount].charges || [];

  const [date, setDate] = useState(null);

  const InfoDay = (calendarDate) => {
    const day = new Date(calendarDate.date).getDate();
    
    const formattedDate = calendarDate.date.toISOString().split('T')[0];  // Get date in "YYYY-MM-DD" format

    // Filter charges for the specific date
    const chargesForDay = charges.filter(charge => {
      const chargeDate = new Date(charge.date).toISOString().split('T')[0];  // Format charge date
      const chargedThisMonth = () => {
        return charge.recurrenceList.includes(calendarDate.date.getMonth())
      }
      // const allreadyCreated = () => {
      //   if (calendarDate.date.getYear() >= chargeDate.slice(0, 4)){
      //     return true
      //   }else{
      //     return false
      //   }
      // }
      return chargeDate.slice(-2) === formattedDate.slice(-2) && chargedThisMonth();  // Compare the date
    });

    return (
      <View>
        <Text >
          {day}
        </Text>
        {chargesForDay.length > 0 && chargesForDay.map((charge, i) => (
          <Text key={i} style={styles.chargeText} onPress={() => navigation.navigate("NewCharge")}>
            {`${charge.amount}€`}
          </Text>
        ))}
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
  arrow: {
    height: 32,
  },


})