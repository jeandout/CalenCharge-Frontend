import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWeeklyNotifications,
  toggleMonthlyNotifications,
  toggleChargeNotifications,
  logOut, removeToken
} from "../reducers/user";
import { Button, Modal, Text, Layout } from "@ui-kitten/components";
import SelectAccount from "../components/SelectAccount";

export default function ParametresScreen({ navigation }) {

  useEffect(() => {
    if (userToken === '') {
      navigation.replace('LoginScreen', { redirected: true });
    }
  }, [userToken, navigation]);

  const dispatch = useDispatch();

  const userToken = useSelector((state) => state.user.value.user.token);
  const email = useSelector((state) => state.user.value.user.email);
  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

  const {
    weeklyNotificationsEnabled,
    monthlyNotificationsEnabled,
    chargeNotificationsEnabled,
  } = useSelector((state) => state.user.value.user.settings);

  function handleSubmit() {
    navigation.navigate("NewAccount");
  }

  const [modalVisible, setModalVisible] = useState(false);

  async function handleDelete() {

    const response = await fetch(`${backend}/users/delete-account`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
    })

    const data = await response.json();

    if (!data.result && data.redirectToLogin) {
      dispatch(logOut());
      navigation.goBack();
    }

    if (data.result) {
      dispatch(logOut());
      setModalVisible(!modalVisible);
      return
    }
    dispatch(logOut());
    setModalVisible(!modalVisible);
  }


  return (
    <Layout style={styles.container}>
      <ScrollView >
        <View style={{ gap: 15 }}>
          <Text category="h6" style={styles.sectionTitle}>Gestion de connexion</Text>
          {userToken ? (
            <View style={{ gap: 10 }}>
              <Text category ='h5' >Connecté en tant que : {email}</Text>
              <Button
                appearance="ghost"
                onPress={() => navigation.navigate("PasswordUpdateScreen")}
              >
                <Text>Modifier votre mot de passe</Text>
              </Button>
              <Button style={styles.button} onPress={() => { dispatch(logOut()); navigation.replace('LoginScreen') }}>
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
                    <Text style={styles.modalText}>Voulez-vous vraiment supprimer votre profil utilisateur {email} ? </Text>
                    <Button onPress={() => handleDelete()}>
                      <Text style={styles.textStyle}>Confirmer</Text>
                    </Button>
                    <Button appearance='ghost' onPress={() => setModalVisible(!modalVisible)}>
                      <Text>Annuler</Text>
                    </Button>
                  </View>
                </View>
              </Modal>
              <Button
                appearance="ghost"
                onPress={() => setModalVisible(true)}>
                <Text>Supprimer votre profil</Text>
              </Button>

            </View>
          ) : (
            <Button>
              <Text
                onPress={() => { dispatch(removeToken()); navigation.replace("LoginScreen") }}
              >
                Se connecter / créer un compte
              </Text>
            </Button>
          )}

          <View style={{ gap: 10 }}>
            <Text category="h6" style={styles.sectionTitle}>Gestion des notifications</Text>
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
          <Text category="h6" style={styles.sectionTitle}>Compte de charges</Text>
          <View style={{gap:10}}>
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
        </View>
      </ScrollView>
    </Layout>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 15,
    padding: 15,
    paddingTop: 55,
  },
  button: {
    backgroundColor: '#979797',
    fontFamily: 'Ubuntu-Bold',
    borderColor: '#979797',
  },
  sectionTitle: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
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
    fontSize: 15,
    lineHeight: 20,
    padding: 10,
    marginBottom: 15,
    textAlign: 'center',
  },


});
