import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Layout,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWeeklyNotifications,
  toggleMonthlyNotifications,
  toggleChargeNotifications,
} from "../reducers/user";
import {
  Button,
  Card,
  Modal,
  Input,
  Icon,
  Datepicker,
} from "@ui-kitten/components";
import SelectAccount from "../components/SelectAccount";
//import jwtDecode from "jwt-decode";

export default function ParametresScreen({ navigation }) {
  const dispatch = useDispatch();

  const userToken = useSelector((state) => state.user.value.user.token);

  //const email = jwtDecode(userToken)

  //console.log(email)

  const {
    weeklyNotificationsEnabled,
    monthlyNotificationsEnabled,
    chargeNotificationsEnabled,
  } = useSelector((state) => state.user.value.user.settings);

  const [calendarDate, setCalendarDate] = useState(new Date());

  function handleSubmit() {
    navigation.navigate("NewAccount");
  }
  // Icône pour le calendrier
  const CalendarIcon = ({ name = "calendar", ...props }) => (
    <Icon {...props} name={name} />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userToken ? (
        <Text>Connecté</Text> // AJOuteR DECONNEXION CHANGER MDP SUPP COMPTE
      ) : (
        <Button>
          <Text
            style={styles.connectButtonText}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            Se connecter / créer un compte
          </Text>
        </Button>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.switchRow}>
          <Text>Hebdomadaires</Text>
          <Switch
            value={weeklyNotificationsEnabled}
            onValueChange={(value) => dispatch(toggleWeeklyNotifications())}
          />
        </View>
        <View style={styles.switchRow}>
          <Text>Mensuelles</Text>
          <Switch
            value={monthlyNotificationsEnabled}
            onValueChange={(value) => dispatch(toggleMonthlyNotifications())}
          />
        </View>
        <View style={styles.switchRow}>
          <Text>A chaque prélèvement</Text>
          <Switch
            value={chargeNotificationsEnabled}
            onValueChange={(value) => dispatch(toggleChargeNotifications())}
          />
        </View>
      </View>
      <View>
        <View style={styles.datePickerContainer}>
          <Text category="label" style={styles.label}>
            Vue Calendrier: choisir le début de période
          </Text>
          <Datepicker
            placeholder="JJ/MM/AAAA"
            date={calendarDate}
            onSelect={setCalendarDate}
            accessoryRight={CalendarIcon}
            style={styles.datePicker}
          />
        </View>
      </View>
      <View>
        <SelectAccount />
        <Button
          appearance="ghost"
          onPress={() => navigation.navigate("UpdateAccount")}
        >
          <Text>Modifier ou supprimer le compte</Text>
        </Button>
        <Button onPress={handleSubmit}>
          <Text>Ajouter un nouveau compte</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f2f2",
    flexGrow: 1,
    marginTop: 15,
  },

  connectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  calendarInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
