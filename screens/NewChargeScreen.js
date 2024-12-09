import {
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Layout, Text, Input, Select, SelectItem, IndexPath, Datepicker, Icon, IconElement, Toggle, Button, } from '@ui-kitten/components';

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCharge } from "../reducers/user";

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
  const accounts = useSelector((state) => state.user.value.accounts);
  const [amount, setAmount] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(new IndexPath(0)); //Changer quand on aura le déroulant
  const [selectedRecurrence, setSelectedRecurrence] = useState(new IndexPath(0));
  const [selectedChargeType, setSelectedChargeType] = useState(new IndexPath(0));
  const [date, setDate] = useState(new Date());

  // const pour le toggle
  const [checked, setChecked] = useState(false);
  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
  };

  //variables pour l'affichage du composant select pour le type
  const type = [
    'Loisir',
    'Logement',
    'Enfants',
    'Autre',
  ];
  const displayTypeValue = type[selectedChargeType.row];
  const renderType = (title) => (
    <SelectItem title={title} />
  );

  //variables pour l'affichage du composant select pour la récurrence
  const recurrence = [
    'Hebdomadaire',
    'Logement',
    'Enfants',
    'Autre',
  ];
  const displayRecurrenceValue = recurrence[selectedRecurrence.row];
  const renderRecurrence = (title) => (
    <SelectItem title={title} />
  );

  // called when add button is pressed
  function handleSubmit() {
    dispatch(addCharge({ name, selectedAccount: selectedAccount.row, recurence: selectedRecurrence.row, chargeType: selectedChargeType.row, date: date.toISOString(), priority: checked, amount }));
    setName('');
    navigation.navigate("TabNavigator") //CHANGER POUR L'ANCIENNE PAGE

  }

  return (
    <Layout style={styles.container}>
      <Text style={styles.text} category='h3'>Ajouter une nouvelle charge</Text>
      <Select
        placeholder='Compte'
        selectedIndex={selectedAccount}
        onSelect={index => setSelectedAccount(index)}
      >
        {accounts.map((option, index) => (
          <SelectItem key={index} title={option.name} />
        ))}
      </Select>
      <Input
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
        placeholder='Pick Date'
        date={date}
        onSelect={nextDate => setDate(nextDate)}
        accessoryRight={CalendarIcon}
      />
      <View style={styles.row}>
        <Text style={styles.text} category='p1'>Prioritaire</Text>
        <Toggle
          checked={checked}
          onChange={onCheckedChange}
        />
      </View>
      <Input
        keyboardType="numeric"
        size='large'
        placeholder='Montant'
        value={amount}
        onChangeText={nextValue => setAmount(nextValue)}
      />
      <Button onPress={() => handleSubmit()}>
        Ajouter
      </Button>
    // </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 15,
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
