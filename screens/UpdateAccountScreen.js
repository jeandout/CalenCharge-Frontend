import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAccount, removeAccount, logOut } from "../reducers/user";
import { Button, Card, Modal, Text, Input, Icon, Layout } from "@ui-kitten/components";
import iconsMap from "../assets/iconsMap";

export default function UpdateAccountScreen({ navigation }) {
  const dispatch = useDispatch();

  const userToken = useSelector((state) => state.user.value.user.token);

  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

  const accounts = useSelector((state) => state.user.value.user.accounts);
  const selectedAccount = useSelector(
    (state) => state.user.value.selectedAccount
  );

  const [accountInput, setAccountInput] = useState(
    accounts[selectedAccount].name
  );
  const [iconInput, setIconInput] = useState(accounts[selectedAccount].icon);
  const [visible, setVisible] = useState(false);

  async function handleSubmit() {

    if(userToken){
          const response = await fetch(`${backend}/accounts/update`, {
          method: 'PUT',
          headers: { 'Content-type': 'application/json',
                'Authorization': `Bearer ${userToken}` },
          body: JSON.stringify({ accountInput, iconInput, account:accounts[selectedAccount] }),
        })
      
        const data = await response.json();

        if(!data.result && data.redirectToLogin){
          dispatch(logOut())
          navigation.goBack();
        }
        
        if(data.result){
          dispatch(updateAccount({ accountInput, iconInput })); 
          setAccountInput("");
          setIconInput("");
          navigation.goBack();
          return
        }
      }

    dispatch(updateAccount({ accountInput, iconInput }));
    setAccountInput("");
    setIconInput("");
    navigation.navigate("TabNavigator");
  }

  async function handleDelete(){

    if(userToken){
      const response = await fetch(`${backend}/accounts/delete`, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json',
            'Authorization': `Bearer ${userToken}` },
      body: JSON.stringify({account:accounts[selectedAccount]}),
    })
  
    const data = await response.json();

    if(!data.result && data.redirectToLogin){
      dispatch(logOut());
      navigation.goBack();
    }

    if(data.result){
      dispatch(removeAccount()); 
      navigation.goBack();
      return
    }
  }

    dispatch(removeAccount());
      navigation.goBack();
  }

  const handleIconPress = (iconName) => {
    setIconInput(iconName);
    setVisible(false);
  };

  const renderIcon = (iconName, props = {}) => (
    <Icon {...props} name={iconName} style={[styles.icon, props.style]} />
  );

  return (
    <Layout style={styles.container}>

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      
      <Text style={styles.text} category='h3'>Modifier un compte bancaire</Text>
      {accounts.length>1 && (<Button
        style={styles.button}
        onPress={handleDelete}
        appearance="ghost"
      >
        <Text>Supprimer le compte</Text>
      </Button>)}
      <View style={styles.previewContainer}>
        {renderIcon(iconInput, { style: styles.selectedIcon })}
        <Button style={styles.button} onPress={() => setVisible(true)}>
          <Text>Changer l'icône</Text>
        </Button>
      </View>

      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card style={styles.card}>
          <View style={styles.grid}>
            {Object.keys(iconsMap).map((iconName) => (
              <TouchableOpacity
                key={iconName}
                onPress={() => handleIconPress(iconName)}
              >
                {renderIcon(iconName)}
              </TouchableOpacity>
            ))}
          </View>
          <Button style={styles.closeButton} onPress={() => setVisible(false)}>
            Fermer
          </Button>
        </Card>
      </Modal>

      <View style={styles.previewContainer}>
      <Text>Nom du compte bancaire :</Text>

        <Input
          placeholder="Nom du compte"
          onChangeText={(value) => setAccountInput(value)}
          status='primary'
          value={accountInput}
          style={styles.input}
        />
      </View>
      <Button style={styles.button} onPress={handleSubmit}>
        <Text>Modifier le compte</Text>
      </Button>
      <Button appearance='ghost' onPress={() => navigation.goBack()}>
          <Text>Annuler</Text>
        </Button>
    </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    padding: 15,
    paddingTop: 55,    
    alignItems: "center",
    backgroundColor: '#F6FDF1',
  },
  text: {
    flexDirection: 'row',
  },
  input: {
    width: "65%",
    marginTop: 16,
    borderBottomWidth: 1,
    fontSize: 16,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 8,
  },
  icon: {
    width: 50,
    height: 50,
    margin: 8,
  },
  selectedIcon: {
    width: 75,
    height: 75,
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 16,
  },
  button:  {
    width: 200,
    marginBottom: 16,
    FontColor: '#979797',
  },
  previewContainer: {
    padding: 20,
    alignItems: "center",
  },
});
