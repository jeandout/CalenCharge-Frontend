import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCharge } from "../reducers/user";

export default function NewChargeScreen({ navigation }) {
  const dispatch = useDispatch();

  const [chargeInput, setChargeInput] = useState("");

  const user = useSelector((state) => state.user.value);

  const [selectedAccount, setSelectedAccount] = useState('Test'); //Changer quand on aura le déroulant

  const accountObj = user.accounts.filter(account=>account.name===selectedAccount);

  function handleSubmit(){
    dispatch(addCharge({name:chargeInput, selectedAccount}));
    setChargeInput('');
    navigation.navigate("TabNavigator") //CHANGER POUR L'ANCIENNE PAGE
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="New charge"
        onChangeText={(value) => setChargeInput(value)}
        value={chargeInput}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Add</Text>
      </TouchableOpacity>
    </View>
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
    marginTop: 6,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
});
