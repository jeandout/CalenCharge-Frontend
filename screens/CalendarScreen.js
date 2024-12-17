import {
  View, StyleSheet, TouchableOpacity, Image, TextInput,
  KeyboardAvoidingView, Platform,
} from "react-native";
import React from 'react';
import { Calendar, Text, Icon, Button, I18nConfig, NativeDateService } from '@ui-kitten/components';
import { useState, useEffect } from "react";
import SelectAccount from "../components/SelectAccount";
import { useSelector } from 'react-redux';
import Charge from "../components/Charge";

const i18nConfig = {
  dayNames: {
    short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    long: ["Dimanche", "Lundi", "Mardi", "Mercredi", 
    "Jeudi", "Vendredi", "Samedi"],
  },
  monthNames: {
    short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", 
    "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
    long: [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ],
  }
};

const localeDateService = new NativeDateService('fr', { i18n: i18nConfig, startDayOfWeek: 1 });



const addIcon = ({ name = 'plus-outline', ...props }) => (
  <Icon
      {...props}
      name={name}
      fill={'white'}
  />
);

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
  const [chargesList, setChargesList] = useState([]); // constante pour afficher la ou les taches sous le calendrier
  const [chargeListDay, setChargeListDay] = useState([]) //contien la date du jour cliqué sur le calendrier pour afficher les charges


  const [date, setDate] = useState(new Date());

  // use<effect pour rerender le calendrier au changement de selectedAccount et accounts
  const [calendarKey, setCalendarKey] = useState(0); // Key for re-rendering Calendar
  useEffect(() => {
    setCalendarKey((prevKey) => prevKey + 1);
    setChargesList([]) // supprime l'affichage des charges en listes sous le calendrier
    setChargeListDay([])
  }, [selectedAccount, date, charges]); //render calendar when start date is changed or account changed

  const InfoDay = (calendarDate) => {

    const day = new Date(calendarDate.date).getDate();

    const formattedDate = calendarDate.date.toISOString().split('T')[0];  // Get date in "YYYY-MM-DD" format

    // Filter charges for the specific date
    const chargesForDay = charges.filter(charge => {
      const chargeDate = new Date(charge.date).toISOString().split('T')[0];  // Format charge date
      const chargedThisMonth = () => {
        return charge.recurrenceList.includes(calendarDate.date.getMonth())
      }
      const allreadyCreated = () => {

        if (calendarDate.date.getFullYear() >= chargeDate.slice(0, 4)) {  //A FAIRE pour vérifier si la date est supérieure au mois de création : (calendarDate.date.getMonth() >= Number(chargeDate.slice(5, 7)))
          return true
        } else {
          return false
        }
      }
      return chargeDate.slice(-2) === formattedDate.slice(-2) && chargedThisMonth() && allreadyCreated();  // Compare the date
    });

    return (
      <View>
        <Text >
          {day}
        </Text>
        <TouchableOpacity style={styles.cell} appearance={'ghost'} onPress={() => handleCharges(chargesForDay)}>
          {chargesForDay.length > 0 && chargesForDay.map((charge, i) => (
            <Text key={i} style={styles.chargeText} >
              {`${charge.amount}€`}
            </Text>
          ))}
        </TouchableOpacity>
      </View>
    ); //background pour fond charge importante : color-warning-500
  };

  const lastDate = (item) => { //set the start date of calendar display function of the month selected to keep the view in memory
    console.log(item)
    setDate(item)
  }

  const goToday = () => { //used to reset the calendar view to current day
    const today = new Date()
    setDate(today)
    console.log(today)
  }

  const handleCharges = (daylyCharges) => { // used to display charges list from calendar day
    
    if (daylyCharges[0].date == chargeListDay[0]) { //si la date cliqué à déja été cliqué
      setChargesList([])
      setChargeListDay(chargeListDay.shift()) //POURQUOI JE PEUX PAS RESET AVEC [] ???

    } else { //ajout des taches de la date cliquée
      const newChargesList = (
        <View>

          {daylyCharges.map((charge, i) => (
            <Charge key={i} navigationCharge={navigation} name={charge.name} amount={charge.amount} date={charge.date} recurrence={charge.recurrence} chargeType={charge.chargeType} priority={charge.priority} />
          ))}
        </View>
      )
      setChargesList(newChargesList)
      setChargeListDay( chargeListDay.push(daylyCharges[0].date)) //ajout de la date cliquée dans le tableau de date cliquée
   
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <SelectAccount />
        <Calendar
          key={calendarKey}
          dateService={localeDateService}
          date={date}
          // onSelect={(nextDate) => setDate(nextDate)}
          renderDay={InfoDay}
          renderArrowLeft={LeftArrow}
          renderArrowRight={RightArrow}
          onVisibleDateChange={lastDate}
        />
        {chargesList}
    
      </View>
      <View style={styles.footer}>
      <Button onPress={() => navigation.navigate("NewCharge")} style={styles.addButton} accessoryLeft={addIcon} />

      <Button onPress={() => goToday()} style={styles.button}><Text>Aujourd'hui</Text></Button>

      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
    gap: 15,
    padding: 15,
    marginTop: 50,
    backgroundColor: '#F9FDF4',
  },

  icon: {
    width: 32,
    height: 32,
  },
  cell: {
    height: 45,
    width: 50,
  },
  arrow: {
    height: 32,
  },
  chargeText: {
    fontSize: 15,

  },
  addButton: {
    position: 'absolute',
    height: 50,
    width: 50,
    bottom: 20, // Position en bas
    right: 20,
    zIndex: 30,
},
  button: {
    height: 50,
    width: 125,
    bottom: 20, // Position en bas
    left: 20,
    zIndex: 30,
    backgroundColor: '#979797'
  },
  buttonTwo:
  {
    
    height: 5,
    width: 75,
  
    backgroundColor: '#979797'
  },

  footer: {
    justifyContent: 'space-between',
    alignContent: 'center'
  },

})