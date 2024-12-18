import {
  View,
  StyleSheet,
  SafeAreaView,
  Switch,
} from "react-native";
import { Layout, Text, Input, Select, SelectItem, IndexPath, Datepicker, Icon, IconElement, Button, } from '@ui-kitten/components';

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCharge, removeToken } from "../reducers/user";
import SelectAccount from "../components/SelectAccount";
import MonthOccurrenceGenerator from "../components/MonthOccurrenceGenerator";
import CheckChargeFields from "../components/CheckChargeFields";

//icone pour l'affichage du calendrier du datepicker
const CalendarIcon = ({ name = 'calendar', ...props }) => (
  <Icon
    {...props}
    name={name}
  />
);


export default function NewChargeScreen({ navigation }) {

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [requieredFieldStatus, setRequieredFieldStatus] = useState('basic')
  const userToken = useSelector((state) => state.user.value.user.token);

  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

  const accounts = useSelector((state) => state.user.value.user.accounts);
  const selectedAccount = useSelector(
    (state) => state.user.value.selectedAccount
  );
  const [amount, setAmount] = useState(0);
  const [selectedRecurrence, setSelectedRecurrence] = useState(new IndexPath(0));
  const [selectedChargeType, setSelectedChargeType] = useState(new IndexPath(0));

  const getLocalMidnightDate = () => { // génère la date actuelle à minuit pour etre correctement interpreté par le datepicker et le calendrier
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const [date, setDate] = useState(getLocalMidnightDate());
  const [checked, setChecked] = useState(false);
  //variables pour l'affichage du composant select pour le type
  const type = [
    'Loisir',
    'Logement',
    'Enfants',
    'Autre',
  ];
  const displayTypeValue = type[selectedChargeType.row];
  const renderType = (title) => (
    <SelectItem title={title} key={title} />
  );

  //variables pour l'affichage du composant select pour la récurrence
  const recurrence = [
    'Mensuelle',
    'Trimestrielle',
    'Annuelle',
  ];
  const displayRecurrenceValue = recurrence[selectedRecurrence.row];
  const renderRecurrence = (title) => (
    <SelectItem title={title} key={title} />
  );

  // called when add button is pressed
  //tt = tt.replace(/,/g, '.')
  async function handleSubmit() {

    const recurrenceList = MonthOccurrenceGenerator(selectedRecurrence.row, date)
    const newCharge = { name, recurrence: selectedRecurrence.row, chargeType: selectedChargeType.row, date: date.toISOString(), priority: checked, amount, recurrenceList }

    if (CheckChargeFields(newCharge, ['name', 'amount',]) && userToken) {

      const response = await fetch(`${backend}/charges/new`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ charge: newCharge, account: accounts[selectedAccount] }),
      })

      const data = await response.json();

      if (!data.result && data.redirectToLogin) {
        dispatch(removeToken());
        navigation.navigate('LoginScreen');
      }

      if (data.result) {
        dispatch(addCharge(newCharge));
        setName('');
        navigation.goBack()
        return
      }
    }


    if (CheckChargeFields(newCharge, ['name', 'amount',])) {
      dispatch(addCharge(newCharge));
      setName('');
      navigation.goBack()
    }
    setRequieredFieldStatus('warning')
  }

  return (
    <Layout style={styles.container} level={'1'}>
      <View style={styles.inputs}>
        <Text style={styles.text} category='h3'>Ajouter une nouvelle charge</Text>
        <SelectAccount />
        <Input
          status={requieredFieldStatus}
          placeholder='Nom'
          value={name}
          onChangeText={nextValue => setName(nextValue)}
        />
        <Select
          placeholder='Default'
          value={displayTypeValue}
          selectedIndex={selectedChargeType}
          onSelect={index => setSelectedChargeType(index)}
        >
          {type.map(renderType)}
        </Select>
        <Select
          placeholder='Default'
          value={displayRecurrenceValue}
          selectedIndex={selectedRecurrence}
          onSelect={index => setSelectedRecurrence(index)}
        >
          {recurrence.map(renderRecurrence)}
        </Select>
        <Datepicker
          label="Début de la récurrence"
          placeholder='Pick Date'
          date={date}
          onSelect={nextDate => setDate(nextDate)}
          accessoryRight={CalendarIcon}
          min={new Date(2000, 0, 1)} // affichage min
          max={new Date(2050, 11, 31)} // affichage max
        />
        <View style={styles.row}>
          <Text style={styles.text} category='p1'>Prioritaire</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#E1FAEB' }}
            thumbColor={checked ? '#55AD9B' : '#f4f3f4'}
            value={checked}
            onValueChange={(value) => setChecked(value)}
          />
        </View>
        <Input
          status={requieredFieldStatus}
          keyboardType="numeric"
          size='large'
          placeholder='Montant'
          value={amount}
          onChangeText={nextValue => setAmount(nextValue)}
        />
      </View>
      <View style={styles.actions}>
        <Button onPress={() => handleSubmit()}>
          <Text>Ajouter</Text>
        </Button>
        <Button appearance='ghost' onPress={() => navigation.goBack()}>
          <Text>Annuler</Text>
        </Button>
      </View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 15,
  },
  inputs: {
    gap: 20,
  },
  actions: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  text: {
    textAlign: 'center',
  },
});
