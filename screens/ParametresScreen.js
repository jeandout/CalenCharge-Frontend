import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform, ScrollView, Switch
} from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAccount } from "../reducers/user";
import { Button, Card, Modal, Input, Icon } from "@ui-kitten/components";

export default function ParametresScreen({ navigation }){

  const dispatch = useDispatch();

  const [monthlyNotifications, setMonthlyNotifications] = useState(false);
  const [weeklyNotifications, setWeeklyNotifications] = useState(false);
  const [paymentNotifications, setPaymentNotifications] = useState(false);
  const [calendarDate, setCalendarDate] = useState("");
 

  function handleSubmit() {
    navigation.navigate("NewAccount");
  }
 
    return(
    <ScrollView contentContainerStyle={styles.container}>   
        <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectButtonText}>Se connecter / créer un compte</Text>
      </TouchableOpacity>

      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.switchRow}>
        <Text>Hebdomadaires</Text>
          <Switch
            value={weeklyNotifications}
            onValueChange={(value) => setWeeklyNotifications(value)}
          />
        </View>
        <View style={styles.switchRow}>
        <Text>Mensuelles</Text>
          <Switch
            value={monthlyNotifications}
            onValueChange={(value) => setMonthlyNotifications(value)}
          />
        </View>
        <View style={styles.switchRow}>
          <Text>A chaque prélèvement</Text>
          <Switch
            value={paymentNotifications}
            onValueChange={(value) => setPaymentNotifications(value)}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vue Calendrier: choisir le début de période</Text>
        <View>
            <TextInput 
            style={styles.calendarInput}
            placeholder="JJ/MM/AAAA"
            value={calendarDate} onChangeText={(text) =>setCalendarDate(text)}/>
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            
        </View>
      </View>
      <View>
      <Button onPress={handleSubmit}><Text>Ajouter un nouveau compte</Text></Button>
      </View>
      </ScrollView> 
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f2f2f2",
        flexGrow: 1,
    },
    connectButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
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
     
      
})