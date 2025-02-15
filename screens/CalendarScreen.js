import {
  View, StyleSheet, TouchableOpacity, Image, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import React from 'react';
import { Calendar, Text, Icon, Button, Layout, NativeDateService, useTheme } from '@ui-kitten/components';
import { useState, useEffect } from "react";
import SelectAccount from "../components/SelectAccount";
import { useSelector } from 'react-redux';
import Charge from "../components/Charge";


const i18n = {
  dayNames: {
    short: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'], // Abréviations en français
    long: [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ], // Jours complets en français
  },
  monthNames: {
    short: [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Aoû',
      'Sep',
      'Oct',
      'Nov',
      'Déc',
    ], // Mois abrégés
    long: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ], // Mois complets
  },
};
const localeDateService = new NativeDateService('fr', { i18n, startDayOfWeek: 1 });

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



export default function CalendarScreen({ navigation }) {

  const userToken = useSelector((state) => state.user.value.user.token);

  useEffect(() => {
    if (userToken === '') {
        navigation.replace('LoginScreen', { redirected: true });
    }
}, [userToken, navigation]);

  const LeftArrow = (arrowProps) => {
    return (
      <View style={styles.calendarNavLeft}>
        <TouchableOpacity
          style={styles.arrow}
          onPress={arrowProps.onPress}>
          {backIcon({})}
        </TouchableOpacity>
        <View
          style={styles.todayButton}
        >
          <Button size='tiny' onPress={() => goToday()}
          >Aujourd'hui</Button>
        </View>
      </View>
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

  const theme = useTheme();

  const accounts = useSelector((state) => state.user.value.user.accounts);
  const selectedAccount = useSelector((state) => state.user.value.selectedAccount);

  const charges = accounts[selectedAccount].charges || [];
  const [chargesList, setChargesList] = useState([]); // constante pour afficher la ou les taches sous le calendrier
  const [chargeListDay, setChargeListDay] = useState([]) //contien la date du jour cliqué sur le calendrier pour afficher les charges

  const [selectedDay, setSelectedDay] = useState(new Date(1970, 0, 1)) // constante pour garder le jour cliqué en mémoire
  const [date, setDate] = useState(new Date());

  // use<effect pour rerender le calendrier au changement de selectedAccount et accounts
  const [calendarKey, setCalendarKey] = useState(0); // Key for re-rendering Calendar
  useEffect(() => {
    setCalendarKey((prevKey) => prevKey + 1);
    setChargesList([]) // supprime l'affichage des charges en listes sous le calendrier
    setChargeListDay([])
  }, [selectedAccount, date, charges]); //render calendar when start date is changed or account changed

  const InfoDay = (calendarDate) => {

    const thisDay = new Date(); // date du jour 
    const day = calendarDate.date.getDate();
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

    const dayStyle = calendarDate.date.getDate() == thisDay.getDate() && calendarDate.date.getMonth() == thisDay.getMonth() ? { backgroundColor: theme['color-primary-500'], color: 'white', borderRadius: 4, paddingHorizontal: 5, } : {}

    //TODO: selectedDay à utiliser pour surligner le jour selectionné

    const calendarChargeDisplay = () => { //permet d'afficher les charges dans le calendrier dynamiquement en fonction de leur nombre

      if (chargesForDay.length == 1) { // Si une seule charge

        return (

          chargesForDay.map((charge, i) => (
            <Text key={i} style={[styles.chargeText, { backgroundColor: (charge.priority ? theme['color-warning-500'] : theme['color-primary-200']) }]}  >
              {`${charge.amount}€`}
            </Text>
          ))
        )
      } else if (chargesForDay.length > 1) { // Si plus d'une charge, affichage du nombre de charge pour ce jour
        let sumOfChargesAmounts = 0
        let priorities = false
        for (let charge of chargesForDay) {

          sumOfChargesAmounts = sumOfChargesAmounts + parseInt(charge.amount)
          if (charge.priority) {
            priorities = true
          }
        }
        return (
          <>
            <View style={[styles.chargeText, { backgroundColor: (priorities ? theme['color-warning-500'] : theme['color-primary-200']) }]}>
              <Text style={{ textAlign: 'center' }}>
                {`${sumOfChargesAmounts}€`}
              </Text>

              <Text style={styles.counter}>
                {`${chargesForDay.length} charges`}
              </Text>
            </View>
          </>
        )
      }
    }

    return (
      <View style={styles.dateContainer}>
        <Text style={[dayStyle, styles.date]}>
          {day}
        </Text>
        <TouchableOpacity style={styles.cell} appearance={'ghost'} onPress={() => handleCharges(chargesForDay, calendarDate.date)}>
          {/* Version qui affiche toutes les charges du jour */}
          {/* {chargesForDay.length > 0 && chargesForDay.map((charge, i) => (
            <Text key={i} style={[styles.chargeText, { backgroundColor: (charge.priority ? theme['color-warning-500'] : theme['color-primary-200']) }]}  >
              {`${charge.amount}€`}
            </Text>
          ))} */}
          {/* Version avec un affichage dynamique selon le nombre de charge */}
          {calendarChargeDisplay()}
        </TouchableOpacity>
      </View>
    ); //background pour fond charge importante : color-warning-500
  };

  const lastDate = (item) => { //set the start date of calendar display function of the month selected to keep the view in memory

    setDate(item)
  }

  const goToday = () => { //used to reset the calendar view to current day
    const today = new Date()
    setDate(today)

  }

  const handleCharges = (daylyCharges, daySelected) => { // used to display charges list from calendar day

    setSelectedDay(daySelected)
    setChargesList(chargesList.filter(e => e == 0))

    if (daylyCharges.length === 0) { //si la date cliqué n'a pas de charge
      setChargeListDay(chargeListDay.filter(e => e == 0))
    } else if (daylyCharges[0].date === chargeListDay[0]) { // NE FONCTIONNE PAS 
      setChargeListDay(chargeListDay.filter(e => e == 0))
    } else { //ajout des taches de la date cliquée
      setChargesList(...chargesList, daylyCharges)
      setChargeListDay(chargeListDay.filter(e => e == 0))
      setChargeListDay([...chargeListDay, daylyCharges[0].date]) //ajout de la date cliquée dans le tableau de date cliquée
    }
  };



  const chargesListTodisplay = (
    <View>

      {chargesList.map((charge, i) => (
        <Charge key={i} navigationCharge={navigation} name={charge.name} amount={charge.amount} date={charge.date} recurrence={charge.recurrence} chargeType={charge.chargeType} priority={charge.priority} />
      ))}
    </View>
  )


  return (
    <Layout style={styles.container}>
      <ScrollView>
        <View style={styles.main}>
          <SelectAccount />
          <Calendar style={styles.calendar}
            dateService={localeDateService} //calendrier en français
            key={calendarKey}
            date={date}
            // onSelect={(nextDate) => setDate(nextDate)}
            renderDay={InfoDay}
            renderArrowLeft={LeftArrow}
            renderArrowRight={RightArrow}
            onVisibleDateChange={lastDate}
            min={new Date(2000, 0, 1)} // affichage min
            max={new Date(2050, 11, 31)} // affichage max
          />
          {chargesListTodisplay}
        </View>
      </ScrollView>

      <Button onPress={() => navigation.navigate("NewCharge")} style={styles.addButton} accessoryLeft={addIcon} />



    </Layout>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 15,
    padding: 15,
    paddingTop: 55,


  },
  main: {
    flex: 1,
    gap: 15,
    paddingBottom: 60,
  },
  calendar: {
    width: '100%',
  },
  dateContainer: {
    alignItems: 'center',
  },
  date: {
    // aspectRatio: 1,
    textAlign: 'center',
  },
  calendarNavLeft: {
    flexDirection: 'row',
    gap: 10,
    marginRight: 10,
  },
  todayButton: {
    height: 32,
  },
  cell: {
    paddingTop: 2,
    height: 35,
    fontStyle: 'bold',
    width: "100%",
  },
  arrow: {
    height: 32,
  },
  chargeText: {
    fontSize: 15,
    textAlign: 'center',
    padding: 2,
    borderRadius: 7,
  },
  counter: {
    fontSize: 9,
    paddingRight: 2,
    textAlign: 'right',
    fontWeight: 900,
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


})