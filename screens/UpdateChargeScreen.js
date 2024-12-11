import { View, StyleSheet, SafeAreaView } from "react-native";
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
  Toggle,
  Button,
} from "@ui-kitten/components";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCharge, removeCharge } from "../reducers/user";
import MonthOccurrenceGenerator from "../components/MonthOccurrenceGenerator";
//icone pour l'affichage du calendrier du datepicker
const CalendarIcon = ({ name = "calendar", ...props }) => (
  <Icon {...props} name={name} />
);

export default function UpdateChargeScreen({ navigation, route }) {

  const { navigationCharge, ...propsFromCharge } = route.params.props;

  const dispatch = useDispatch();

  const [name, setName] = useState(propsFromCharge.name);

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
  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
  };

  //variables pour l'affichage du composant select pour le type
  const type = ["Loisir", "Logement", "Enfants", "Autre"];
  const displayTypeValue = type[selectedChargeType.row];
  const renderType = (title) => <SelectItem title={title} key={title} />;

  //variables pour l'affichage du composant select pour la récurrence
  const recurrence = ["Mensuelle", "Trimestrielle", "Annuelle"];
  const displayRecurrenceValue = recurrence[selectedRecurrence.row];
  const renderRecurrence = (title) => <SelectItem title={title} key={title} />;

  // called when add button is pressed
  function handleSubmit() {
    const recurrenceList = MonthOccurrenceGenerator(selectedRecurrence.row, date)
    dispatch(
      updateCharge({
        oldCharge: propsFromCharge,
        updatedCharge: {
          name,
          recurrence: selectedRecurrence.row,
          chargeType: selectedChargeType.row,
          date: date.toISOString(),
          priority: checked,
          amount,
          recurrenceList,
        },
      })
    );
    setName("");
    navigation.goBack();
  }

  return (
    <Layout style={styles.container}>
      <View style={styles.inputs}>
        <Text style={styles.text} category="h3">
          Modifier une charge
        </Text>
        <Button status="danger" onPress={() => { dispatch(removeCharge(propsFromCharge)); navigation.goBack() }}>
          <Text>Supprimer la charge</Text>
        </Button>
        <Input
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
          <Toggle checked={checked} onChange={onCheckedChange}></Toggle>
        </View>
        <Input
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
