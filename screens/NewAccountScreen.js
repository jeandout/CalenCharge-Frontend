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
import { useDispatch } from "react-redux";
import { addAccount } from "../reducers/user";

export default function NewAccountScreen({ navigation }) {
  
    const dispatch = useDispatch();

  const [accountInput, setAccountInput] = useState("");

  function handleSubmit(){
    dispatch(addAccount(accountInput));
    setAccountInput('');
    navigation.navigate("TabNavigator")
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="New account"
        onChangeText={(value) => setAccountInput(value)}
        value={accountInput}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Add account</Text>
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
