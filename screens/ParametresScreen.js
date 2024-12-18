import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Switch,
  Layout,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWeeklyNotifications,
  toggleMonthlyNotifications,
  toggleChargeNotifications,
  logOut
} from "../reducers/user";
import {
  Button,
  Card,
  Modal,
  Icon,
} from "@ui-kitten/components";
import SelectAccount from "../components/SelectAccount";

export default function ParametresScreen({ navigation }) {

  const dispatch = useDispatch();

  const userToken = useSelector((state) => state.user.value.user.token);
  const email = useSelector((state) => state.user.value.user.email);

  const {
    weeklyNotificationsEnabled,
    monthlyNotificationsEnabled,
    chargeNotificationsEnabled,
  } = useSelector((state) => state.user.value.user.settings);

  const [calendarDate, setCalendarDate] = useState(new Date());

  function handleSubmit() {
    navigation.navigate("NewAccount");
  }
  
  const [modalVisible, setModalVisible] = useState(false);

  return (

    <ScrollView contentContainerStyle={styles.container}>
      {userToken ? (
        <View style={{}}>
          <Text style={styles.connected} > Connecté en tant que : {email}</Text>
          <Button onPress={() => dispatch(logOut())}>
          <Text>Se déconnecter</Text>
          </Button>
        
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('La fenêtre modale a été fermée.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Voulez-vous vraiment supprimer votre profil utilisateur ? </Text>
              <Button
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)} >
                <Text style={styles.textStyle} onPress={() => dispatch(logOut())}>Confirmer</Text>
              </Button>
              <Button appearance='ghost' onPress={() => setModalVisible(!modalVisible)}>
          <Text>Annuler</Text>
        </Button>
            </View>
          </View>
        </Modal>
        <Button
          appearance="ghost"
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text>Supprimer votre profil</Text>
        </Button>
      
        </View> // AJOuteR DECONNEXION CHANGER MDP SUPP COMPTE
      ) : (
        <Button>
          <Text

            onPress={() => navigation.navigate("LoginScreen")}
          >
            Se connecter / créer un compte
          </Text>
        </Button>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gestion des notifications</Text>
        <View style={styles.switchRow}>
          <Text style={styles.text}>Hebdomadaires</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#E1FAEB' }}
            thumbColor={weeklyNotificationsEnabled ? '#55AD9B' : '#f4f3f4'}
            value={weeklyNotificationsEnabled}
            onValueChange={(value) => dispatch(toggleWeeklyNotifications())}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.text}>Mensuelles</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#E1FAEB' }}
            thumbColor={monthlyNotificationsEnabled ? '#55AD9B' : '#f4f3f4'}
            value={monthlyNotificationsEnabled}
            onValueChange={(value) => dispatch(toggleMonthlyNotifications())}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.text}>A chaque prélèvement</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#E1FAEB' }}
            thumbColor={chargeNotificationsEnabled ? '#55AD9B' : '#f4f3f4'}
            value={chargeNotificationsEnabled}
            onValueChange={(value) => dispatch(toggleChargeNotifications())}
          />
        </View>
      </View>
      <View>

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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 15,
    padding: 15,
    marginTop: 40,
    backgroundColor: '#F6FDF1'
  },
  connected: {
    fontFamily: 'Ubuntu-Bold',
    color: '#303632',
    fontSize: 16, 
    fontWeight: '500', 
    color: '#555',
    marginBottom: 20,
    marginTop: 15,
  },
  name: {
    fontFamily: 'Ubuntu-Bold',
  },
  section: {
    marginBottom: 30,
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Ubuntu-Bold',
    color: '#303632',
    fontSize: 18, 
    marginBottom: 15,
  },
  switchRow: {
    fontFamily: 'Ubuntu-Regular',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontFamily: 'Ubuntu-Regular',
    color: '#303632',
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: '#000000',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 15,
    lineHeight: 20,
    padding: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  

});
