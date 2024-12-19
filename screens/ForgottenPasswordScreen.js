import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Text, Layout, Input } from "@ui-kitten/components";

export default function ForgottenPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const response = await fetch(`${backend}/users/reset-password`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!data.result) {
      Alert.alert(`Erreur lors de l'envoi du mail, veuillez vérifier votre adresse`);
      return;
    }

    if (data.result) {
      Alert.alert("Nouveau mot de passe envoyé avec succès");
    }
   };

  return (
    <Layout style={styles.container}>
      <Text category="h3" style={{ textAlign: "center" }}>
        Mot de passe oublié :
      </Text>

      <View style={{ gap: 20 }}>
        <Input
          style={{ width: "100%" }}
          placeholder="Votre e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={{ gap: 10 }}>
        <Button onPress={handleSubmit}>
          <Text>Envoyer un nouveau mot de passe à cette adresse</Text>
        </Button>
        <Button appearance="ghost" onPress={() => navigation.goBack()}>
          <Text>Retour</Text>
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    padding: 15,
    justifyContent: "space-between",
  },
  iconContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
