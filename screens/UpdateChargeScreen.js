import { View, StyleSheet, SafeAreaView, Switch, TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Keyboard, } from "react-native";
import {
  Layout,
  Text,
  Input,
  Select,
  SelectItem,
  IndexPath,
  Datepicker,
  Icon,
  Button,
} from "@ui-kitten/components";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCharge, removeCharge, logOut } from "../reducers/user";
import MonthOccurrenceGenerator from "../components/MonthOccurrenceGenerator";
import CheckChargeFields from "../components/CheckChargeFields";
//icone pour l'affichage du calendrier du datepicker
const CalendarIcon = ({ name = "calendar", ...props }) => (
  <Icon {...props} name={name} />
);

const Trash = (props) => (
  <Icon
    {...props}
    name='trash-2-outline'
  />
);

export default function UpdateChargeScreen({ navigation, route }) {

  const { navigationCharge, ...propsFromCharge } = route.params.props;

  const dispatch = useDispatch();

  const [name, setName] = useState(propsFromCharge.name);

  const [requieredFieldStatus, setRequieredFieldStatus] = useState('basic')

  const [amount, setAmount] = useState(propsFromCharge.amount.toString());

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
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ oldCharge: propsFromCharge, updatedCharge, account: accounts[selectedAccount] }),
      })

      const data = await response.json();

      if (!data.result && data.redirectToLogin) {
        dispatch(logOut());
        navigation.goBack();
      }

      if (data.result) {
        dispatch(
          updateCharge({
            oldCharge: propsFromCharge,
            updatedCharge,
          })
        );
        setName("");
        navigation.goBack();
        return
      }
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

  async function handleDelete() {

    if (userToken) {
      const response = await fetch(`${backend}/charges/delete`, {
        method: 'delete',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ oldCharge: propsFromCharge, account: accounts[selectedAccount] }),
      })

      const data = await response.json();

      if (!data.result && data.redirectToLogin) {
        dispatch(logOut());
        navigation.goBack();
      }

      if (data.result) {
        dispatch(removeCharge(propsFromCharge))
        navigation.goBack();
        return
      }
    }
    
    dispatch(removeCharge(propsFromCharge))
    navigation.goBack()
  }
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
        <View style={styles.inputs}>
        <Text style={styles.text} category="h3">
          Modifier une charge
        </Text>
        <Button status="danger" onPress={handleDelete} accessoryRight={Trash} size='small'>
          <Text>Supprimer la charge</Text>
        </Button>
        <Input
        label="Nom de la charge"
          status={requieredFieldStatus}
          placeholder="Nom"
          value={name}
          onChangeText={(nextValue) => setName(nextValue)}
        />
        <Select style={{width:"100%"}}
        label="Type de charge"
          placeholder="Default"
          value={displayTypeValue}
          selectedIndex={selectedChargeType}
          onSelect={(index) => setSelectedChargeType(index)}
        >
          {type.map(renderType)}
        </Select>
        <View style={{flexDirection:'row', gap:10, alignItems:'end'}}>
          <Select style={{flex:1}}
          label="Récurrence"
            placeholder="Default"
            value={displayRecurrenceValue}
            selectedIndex={selectedRecurrence}
            onSelect={(index) => setSelectedRecurrence(index)}
          >
            {recurrence.map(renderRecurrence)}
          </Select>
          <Datepicker style={{flex:1}}
            label="Début de la récurrence"
            placeholder="Pick Date"
            date={date}
            onSelect={(nextDate) => setDate(nextDate)}
            accessoryRight={CalendarIcon}
            min={new Date(2000, 0, 1)} // affichage min
            max={new Date(2050, 11, 31)} // affichage max
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.text} category="p1">
            Charge prioritaire
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#E1FAEB' }}
            thumbColor={checked ? '#55AD9B' : '#f4f3f4'}
            value={checked}
            onValueChange={(value) => setChecked(value)}
          />
        </View>
        <Input style={{width:"30%"}}
        label="Montant"
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
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 15,
    paddingTop:55,
    backgroundColor: '#F6FDF1',
  },
  inputs: {
    gap: 15,
    alignItems:'center',
    
  },
  actions: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    width:"100%",
  },
  text: {
    textAlign: "center",
  },
});
