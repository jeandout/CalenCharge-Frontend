import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, } from 'react-native';
import { Button, Input, Text, Layout, Icon } from '@ui-kitten/components';
import { useDispatch, useSelector } from "react-redux";
import { addToken, addEmail, syncDB } from "../reducers/user";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);


  const dispatch = useDispatch();

  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

  function isEmail(emailAdress) {
    let regex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;

    if (emailAdress.match(regex))
      return true;

    else
      return false;
  }

  const handleSubmit = async () => {

    if (!email || !password) { //UTILISER CHECKCHARGEFIELD
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (isEmail(email) == false) {
      Alert.alert('Erreur', "Le format du mail n'est pas correct");
      return;
    }

    const response = await fetch(`${backend}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json();

    if (!data.result) {
      Alert.alert(data.message);
      return;
    }

    if (data.result) {
      dispatch(addToken(data.token));
      dispatch(addEmail(email))
      dispatch(syncDB({ settings: data.settings, accounts: data.accounts }))
      navigation.navigate('TabNavigator');
    }

    navigation.navigate('TabNavigator');
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
    <Layout level='1' style={styles.container}>

      <View style={styles.top}>
        <Text category='h3'>Connexion</Text>
      </View>
      <View style={styles.inputs}>
        <Input
          style={{ width: "100%" }}
          placeholder="Votre e-mail"
          keyboardType="email-address" // clavier type adresse mail
          autoCapitalize="none"       // en miniscule
          value={email}
          onChangeText={setEmail}
        />
        <Input
          style={{ width: "100%" }}
          placeholder="Mot de passe"
          accessoryRight={renderIcon}
          secureTextEntry={showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <Text style={{ fontWeight: 700 }} onPress={() => navigation.goBack()}>Mot de passe oublié ?</Text>
      </View>
      <View style={styles.actions}>
        <Button onPress={handleSubmit}>
          <Text >Valider</Text>
        </Button>
        <Button status='info' onPress={() => navigation.goBack()}>
          <Text >Retour</Text>
        </Button>
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
});