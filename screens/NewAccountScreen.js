import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAccount } from "../reducers/user";
import { Button, Card, Modal, Text, Input, Icon } from "@ui-kitten/components";
import iconsMap from "../assets/iconsMap";

export default function NewAccountScreen({ navigation }) {
  const dispatch = useDispatch();

  const [accountInput, setAccountInput] = useState("");
  const [iconInput, setIconInput] = useState("person-outline"); 
  const [visible, setVisible] = useState(false);

  const userToken = useSelector((state) => state.user.value.user.token);

  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

  async function handleSubmit() {

    if(userToken){
      const response = await fetch(`${backend}/accounts/new`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json',
            'Authorization': `Bearer ${userToken}` },
      body: JSON.stringify({ accountInput, iconInput }),
    })
  
    const data = await response.json();

    console.log(data)

    if(data.result){
      dispatch(addAccount({ accountInput, iconInput })); 
      setAccountInput("");
      navigation.goBack();
      return
    }
  }
  
    dispatch(addAccount({ accountInput, iconInput })); 
    setAccountInput("");
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text>Ajouter un compte bancaire :</Text>
      <View style={styles.previewContainer}>

        {renderIcon(iconInput, { style: styles.selectedIcon })}
        <Button onPress={() => setVisible(true)}><Text>Changer l'icône</Text></Button>
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
        <Input
          placeholder="Nom du compte"
          onChangeText={(value) => setAccountInput(value)}
          value={accountInput}
          style={styles.input}
        />
      </View>
      <Button onPress={handleSubmit}><Text>Ajouter un compte</Text></Button>
      <Button appearance='ghost' onPress={() => navigation.goBack()}>
          <Text>Annuler</Text>
        </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  input: {
    width: "65%",
    marginTop: 16,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    padding: 16,
    borderRadius: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
    tintColor: "#303632",
  },
  closeButton: {
    marginTop: 16,
  },
  previewContainer: {
    padding: 20,
    alignItems: "center",
  },
});
