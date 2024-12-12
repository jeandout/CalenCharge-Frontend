import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, Alert } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useDispatch, useSelector } from "react-redux";
import { addToken } from "../reducers/user";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

  const handleSubmit = async () => {
    if (!email || !password) {
     Alert.alert('Erreur', 'Veuillez remplir tous les champs');
     return;
   }

   const response = await fetch(`${backend}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email, password}),
  })

  const data = await response.json();

       if (!data.result) {
        Alert.alert(data.message);
        return;
      }

  console.log(data.token)

  if (data.result){
    dispatch(addToken(data.token));
    navigation.navigate('TabNavigator');
  }

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Votre e-mail" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"  // clavier type adresse mail
        autoCapitalize="none"        // en miniscule
      />
      <TextInput 
        style={styles.input} 
        placeholder="Mot de passe" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry    // cache le mot de passe lors de la saisie
              />
      <Button style={styles.button} onPress={handleSubmit}>
        <Text>Valider</Text>
      </Button>
      <Button style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
        <Text>Retour</Text>
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
});
