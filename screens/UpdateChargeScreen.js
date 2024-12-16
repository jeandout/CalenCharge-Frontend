import { View, StyleSheet, SafeAreaView, Switch } from "react-native";
import {
  Layout,
  Text,
  Input,
  Select,
  SelectItem,
  IndexPath,
  Datepicker,
  Icon,
  IconElement,
  Button,
} from "@ui-kitten/components";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCharge, removeCharge } from "../reducers/user";
import MonthOccurrenceGenerator from "../components/MonthOccurrenceGenerator";
import CheckChargeFields from "../components/CheckChargeFields";
//icone pour l'affichage du calendrier du datepicker
const CalendarIcon = ({ name = "calendar", ...props }) => (
  <Icon {...props} name={name} />
);

export default function UpdateChargeScreen({ navigation, route }) {

  const { navigationCharge, ...propsFromCharge } = route.params.props;

  const dispatch = useDispatch();

  const [name, setName] = useState(propsFromCharge.name);

  const [requieredFieldStatus, setRequieredFieldStatus] = useState('basic')

  const [amount, setAmount] = useState(propsFromCharge.amount);

  const [selectedRecurrence, setSelectedRecurrence] = useState(
    new IndexPath(propsFromCharge.recurrence)
  );
  const [selectedChargeType, setSelectedChargeType] = useState(
    new IndexPath(propsFromCharge.chargeType)
  );
  const [date, setDate] = useState(new Date(propsFromCharge.date));

  // const pour le toggle
  const [checked, setChecked] = useState(propsFromCharge.priority);

  //variables pour l'affichage du composant select pour le type
  const type = ["Loisir", "Logement", "Enfants", "Autre"];
  const displayTypeValue = type[selectedChargeType.row];
  const renderType = (title) => <SelectItem title={title} key={title} />;

  //variables pour l'affichage du composant select pour la récurrence
  const recurrence = ["Mensuelle", "Trimestrielle", "Annuelle"];
  const displayRecurrenceValue = recurrence[selectedRecurrence.row];
  const renderRecurrence = (title) => <SelectItem title={title} key={title} />;

  const userToken = useSelector((state) => state.user.value.user.token);

  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

  const accounts = useSelector((state) => state.user.value.user.accounts);
  const selectedAccount = useSelector(
    (state) => state.user.value.selectedAccount
  );

  // called when add button is pressed
  async function handleSubmit() {
    const recurrenceList = MonthOccurrenceGenerator(selectedRecurrence.row, date)
    const updatedCharge = {
      name,
      recurrence: selectedRecurrence.row,
      chargeType: selectedChargeType.row,
      date: date.toISOString(),
      priority: checked,
      amount,
      recurrenceList,
    };

    if (CheckChargeFields(updatedCharge, ['name', 'amount',]) && userToken) {
    const response = await fetch(`${backend}/charges/update`, {
            method: 'put',
            headers: { 'Content-type': 'application/json',
                  'Authorization': `Bearer ${userToken}` },
            body: JSON.stringify({oldCharge: propsFromCharge, updatedCharge, account:accounts[selectedAccount]}),
          })
        
          const data = await response.json();
    
          if(data.result){
            dispatch(
              updateCharge({
                oldCharge: propsFromCharge,
                updatedCharge,
              })
            );
            setName("");
            navigation.goBack();
          return}
    }

    if (CheckChargeFields(updatedCharge, ['name', 'amount',])) {
      dispatch(
        updateCharge({
          oldCharge: propsFromCharge,
          updatedCharge,
        })
      );
      setName("");
      navigation.goBack();
    }

    setRequieredFieldStatus('warning')
  }

  async function handleDelete(){

    if (userToken) {
      const response = await fetch(`${backend}/charges/delete`, {
              method: 'delete',
              headers: { 'Content-type': 'application/json',
                    'Authorization': `Bearer ${userToken}` },
              body: JSON.stringify({oldCharge: propsFromCharge, account:accounts[selectedAccount]}),
            })
          
            const data = await response.json();
      
            if(data.result){
              dispatch(removeCharge(propsFromCharge))
              navigation.goBack();
            return}
      }
    
    dispatch(removeCharge(propsFromCharge))
    navigation.goBack()
  }

  return (
    <Layout style={styles.container} level={'1'}>
      <View style={styles.inputs}>
        <Text style={styles.text} category="h3">
          Modifier une charge
        </Text>
        <Button status="danger" onPress={handleDelete}>
          <Text>Supprimer la charge</Text>
        </Button>
        <Input
          status={requieredFieldStatus}
          placeholder="Nom"
          value={name}
          onChangeText={(nextValue) => setName(nextValue)}
        />
        <Select
          placeholder="Default"
          value={displayTypeValue}
          selectedIndex={selectedChargeType}
          onSelect={(index) => setSelectedChargeType(index)}
        >
          {type.map(renderType)}
        </Select>
        <Select
          placeholder="Default"
          value={displayRecurrenceValue}
          selectedIndex={selectedRecurrence}
          onSelect={(index) => setSelectedRecurrence(index)}
        >
          {recurrence.map(renderRecurrence)}
        </Select>
        <Datepicker
          label="Début de la récurrence"
          placeholder="Pick Date"
          date={date}
          onSelect={(nextDate) => setDate(nextDate)}
          accessoryRight={CalendarIcon}
        />
        <View style={styles.row}>
          <Text style={styles.text} category="p1">
            Prioritaire
          </Text>
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
          size="large"
          placeholder="Montant"
          value={amount}
          onChangeText={(nextValue) => setAmount(nextValue)}
        />
      </View>
      <View style={styles.actions}>
        <Button onPress={() => handleSubmit()}>
          <Text>Modifier</Text>
        </Button>
        <Button appearance="ghost" onPress={() => navigation.goBack()}>
          <Text>Annuler</Text>
        </Button>
      </View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    padding: 15,
  },
  inputs: {
    gap: 20,
  },
  actions: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  text: {
    textAlign: "center",
  },
});
