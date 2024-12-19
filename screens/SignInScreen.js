import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useDispatch, useSelector } from "react-redux";
import { addToken, addEmail, syncDB } from "../reducers/user";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

  const handleSubmit = async () => {

    if (!email || !password) { //UTILISER CHECKCHARGEFIELD
     Alert.alert('Erreur', 'Veuillez remplir tous les champs');
     return;
   }
      const response = await fetch(`${backend}/users/signin`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({email, password}),
     })
   
     const data = await response.json();

     if (!data.result) {
      Alert.alert(data.message);
      return;
    }
   
     if (data.result){
       dispatch(addToken(data.token));
       dispatch(addEmail(email))
       dispatch(syncDB({settings:data.settings,accounts:data.accounts}))
       navigation.navigate('TabNavigator');
     }

    navigation.navigate('TabNavigator');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Votre e-mail" 
        keyboardType="email-address" // clavier type adresse mail
        autoCapitalize="none"       // en miniscule
        value={email} 
        onChangeText={setEmail} 
      />
      
      <View style={styles.passwordContainer}>
       <TextInput 
        style={styles.passwordInput} 
        placeholder="Mot de passe" 
        secureTextEntry={!showPassword} // permet de contrôler l'affichage du mot de passe
        value={password} 
        onChangeText={setPassword} 
       />
       <TouchableOpacity style={styles.iconContainer}
       onPress={()=>setShowPassword(!showPassword)}> 
        <Icon
        name={showPassword ?'eye-off':'eye'}
        size={24}
        color="gray"
        />
       </TouchableOpacity>
      </View>
      
      <Button style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Valider</Text>
      </Button>
      
      <Button style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.buttonText}>Retour</Text>
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
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  iconContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
  
});