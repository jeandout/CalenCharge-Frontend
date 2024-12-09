import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAccount } from "../reducers/user";
import { Button, Card, Modal, Text, Input } from "@ui-kitten/components";

export default function NewAccountScreen({ navigation }) {
  const dispatch = useDispatch();

  const [accountInput, setAccountInput] = useState("");
  const [iconInput, setIconInput] = useState(
    require("../assets/iconsAccount/person-outline.png")
  );
  const [visible, setVisible] = useState(false);

  function handleSubmit() {
    dispatch(addAccount({accountInput, iconInput}));
    setAccountInput("");
    navigation.navigate("TabNavigator");
  }

  const iconsMap = {
    "award-outline.png": require("../assets/iconsAccount/award-outline.png"),
    "briefcase-outline.png": require("../assets/iconsAccount/briefcase-outline.png"),
    "color-palette-outline.png": require("../assets/iconsAccount/color-palette-outline.png"),
    "flash-outline.png": require("../assets/iconsAccount/flash-outline.png"),
    "gift-outline.png": require("../assets/iconsAccount/gift-outline.png"),
    "globe-2-outline.png": require("../assets/iconsAccount/globe-2-outline.png"),
    "heart-outline.png": require("../assets/iconsAccount/heart-outline.png"),
    "moon-outline.png": require("../assets/iconsAccount/moon-outline.png"),
    "music-outline.png": require("../assets/iconsAccount/music-outline.png"),
    "people-outline.png": require("../assets/iconsAccount/people-outline.png"),
    "person-outline.png": require("../assets/iconsAccount/person-outline.png"),
    "pricetags-outline.png": require("../assets/iconsAccount/pricetags-outline.png"),
    "scissors-outline.png": require("../assets/iconsAccount/scissors-outline.png"),
    "smiling-face-outline.png": require("../assets/iconsAccount/smiling-face-outline.png"),
    "sun-outline.png": require("../assets/iconsAccount/sun-outline.png"),
    "trending-down-outline.png": require("../assets/iconsAccount/trending-down-outline.png"),
    "trending-up-outline.png": require("../assets/iconsAccount/trending-up-outline.png"),
    "umbrella-outline.png": require("../assets/iconsAccount/umbrella-outline.png"),
  };

  const handleIconPress = (iconName) => {
    setIconInput(iconsMap[iconName]);
    setVisible(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
        <Text>Ajouter un compte bancaire :</Text>
        <View style={styles.previewContainer}>
      <Image source={iconInput} style={styles.selectedIcon}></Image>
      <Button onPress={() => setVisible(true)}>Changer l'icône</Button>
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
                <Image source={iconsMap[iconName]} style={styles.icon} />
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
      <Button onPress={handleSubmit}>Ajouter un compte</Button>
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
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
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
    button: {
      marginVertical: 16,
    },
    previewContainer: {
      padding: 20,
      alignItems: 'center',
    },
  });
  