import {
  View,
  StyleSheet,
  SafeAreaView,
  Switch,
} from "react-native";
import { Layout, Text, Input, Select, SelectItem, IndexPath, Datepicker, Icon, IconElement, Button, } from '@ui-kitten/components';

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCharge } from "../reducers/user";
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
  const accounts = useSelector((state) => state.user.value.user.accounts);
  const [amount, setAmount] = useState(0);
  // const [selectedAccount, setSelectedAccount] = useState(new IndexPath(0)); //Changer quand on aura le déroulant
  const [selectedRecurrence, setSelectedRecurrence] = useState(new IndexPath(0));
  const [selectedChargeType, setSelectedChargeType] = useState(new IndexPath(0));
  const [date, setDate] = useState(new Date());

  // const pour le toggle - REMPLACé PAR SWITCH FROM REACT
  // const [checked, setChecked] = useState(false);
  // const onCheckedChange = (isChecked) => {
  //   setChecked(isChecked);
  // };
  // console.log(checked)
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
  function handleSubmit() {
    const recurrenceList = MonthOccurrenceGenerator(selectedRecurrence.row, date)
    const newCharge = { name, recurrence: selectedRecurrence.row, chargeType: selectedChargeType.row, date: date.toISOString(), priority: checked, amount, recurrenceList }
    if (CheckChargeFields(newCharge, ['name', 'amount',])) {
      dispatch(addCharge(newCharge)); //add recurrenceList : checkMonth (selectedRecurrence.row, date)  en entrée, date et type de récurence, en sortie tableau d'index de mois. Mettre à jour pour supprimer index hebdo (mois, trimestre, année), création, modification et composant charge. Ajouter label date de premiere occurence sur le selecteur de date
      setName('');
      navigation.navigate("TabNavigator") //CHANGER POUR L'ANCIENNE PAGE
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
