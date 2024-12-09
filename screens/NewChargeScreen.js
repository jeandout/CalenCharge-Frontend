import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Layout, Text, Input, Select, SelectItem, IndexPath, Datepicker, Icon, IconElement, Toggle, Button, } from '@ui-kitten/components';

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCharge } from "../reducers/user";

const CalendarIcon = (props) => (
  <Icon
    {...props}
    name='calendar'
  />
);

export default function NewChargeScreen({ navigation }) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");

  const user = useSelector((state) => state.user.value);

  const [selectedAccount, setSelectedAccount] = useState('Test'); //Changer quand on aura le déroulant

  const accountObj = user.accounts.filter(account => account.name === selectedAccount);

  const [amount, setAmount] = useState('');
  const [selectedRecurrence, setSelectedRecurrence] = useState();
  const [selectedChargeType, setSelectedChargeType] = useState();

  const [date, setDate] = useState(new Date());

  const [checked, setChecked] = useState(false);
  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
  };

  function handleSubmit() {
    dispatch(addCharge({ name, selectedAccount }));
    setName('');
    navigation.navigate("TabNavigator") //CHANGER POUR L'ANCIENNE PAGE
  }

  return (
    <Layout
      style={styles.container}
      level='1'
    >
      <Text style={styles.text} category='h1'>Ajouter une nouvelle charge</Text>

      <Input
        placeholder='Nom'
        value={name}
        onChangeText={nextValue => setName(nextValue)}
      />
      <Select
        placeholder='Type de charge'
        selectedIndex={selectedChargeType}
        onSelect={index => setSelectedChargeType(index)}
      >
        <SelectItem title='Loisir' />
        <SelectItem title='Logement' />
        <SelectItem title='Enfants' />
        <SelectItem title='Autre' />
      </Select>
      <Select
        status='Récurence'
        placeholder='Récurence'
        selectedIndex={selectedRecurrence}
        onSelect={index => setSelectedRecurrence(index)}
      >
        <SelectItem title='Hebdomadaire' />
        <SelectItem title='Mensuelle' />
        <SelectItem title='Trimestrielle' />
        <SelectItem title='Semestrielle' />
      </Select>
      <Datepicker
        // label='Label'
        // caption='Caption'
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
        placeholder='Montant'
        value={amount}
        onChangeText={nextValue => setAmount(nextValue)}
      />
      <Button onPress={() => handleSubmit()}>
        Ajouter
      </Button>


    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#ffffff",
    gap:15,
  },
  input: {
    width: "65%",
    marginTop: 6,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
});
