import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, TouchableWithoutFeedback } from 'react-native';
import { Button, Layout, Text, Input, Icon, Spinner } from '@ui-kitten/components';
import { useDispatch, useSelector } from "react-redux";
import { addToken, addEmail } from "../reducers/user";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const dispatch = useDispatch();

  const store = useSelector((state) => state.user.value.user);

  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

  function isEmail(emailAdress) {
    let regex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;

    if (emailAdress.match(regex))
      return true;

    else
      return false;
  }

  const handleSubmit = async () => { //UTILISER CHECKCHARGEFIELD
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (isEmail(email) == false) {
      Alert.alert('Erreur', "Le format du mail n'est pas correct");
      return;
    }
    setIsLoading(true || false: 5000);
    const response = await fetch(`${backend}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, store }),
    })

    const data = await response.json();

    if (!data.result) {
      Alert.alert(data.message);
      return;
    }

    if (data.result) {
      dispatch(addToken(data.token));
      dispatch(addEmail(email))
      navigation.replace('TabNavigator');
    }

  };

  const toggleSecureEntry = () => {
    setShowPassword(!showPassword);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={showPassword ? 'eye-off' : 'eye'}
      />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout style={styles.container}>
      <View style={styles.top}>
        <Text category='h3' >Inscription</Text>
      </View>
      <View style={styles.inputs}>
        <Input
          style={{ width: "100%" }}
          placeholder="Votre e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"  // clavier type adresse mail
          autoCapitalize="none"        // en miniscule
        />
        <Input
          style={{ width: "100%" }}
          placeholder="Mot de passe"
          accessoryRight={renderIcon}
          secureTextEntry={showPassword} // permet de contrôler l'affichage du mot de passe
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.actions}>
      {isLoading ? ( // Afficher le Spinner si en cours de chargement
          <View style={styles.loading}>
          <Spinner size="large" />
          </View>
        ) : (
          <>
        <Button onPress={handleSubmit}>
          <Text>Valider</Text>
        </Button>
        <Button status='info' onPress={() => navigation.goBack()}>
          <Text>Retour</Text>
        </Button>
        </>
      )};
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 55,
    alignItems: 'center',
  },
  top: {
    flex: 1,
    gap: 30,
    justifyContent: 'center',
  },
  inputs: {
    flex: 1,
    padding: 30,
    gap: 20,
    justifyContent: 'center',
  },
  actions: {
    padding: 30,
    gap: 20,
    flex: 1,
    justifyContent: 'center',
    width: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

