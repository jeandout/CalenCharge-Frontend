import { Button } from '@ui-kitten/components'
import React from 'react'
import {View, StyleSheet, Text, ScrollView, TouchableOpacity} from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import { addToken } from "../reducers/user";


export default function LoginScreen({ navigation }){

  const userToken = useSelector((state) => state.user.value.user.token);

  if(userToken || userToken===null){
    navigation.navigate('TabNavigator')
  }

  const dispatch = useDispatch();

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>CalenCharge</Text>

            <Button style={styles.button} onPress={()=>navigation.navigate('SignInScreen')}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </Button>

            <Button style={styles.button} onPress={()=>navigation.navigate('SignUpScreen')}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </Button>

            <Text style={styles.link} onPress={()=>{dispatch(addToken(null));navigation.navigate('TabNavigator')}}>Continuer sans se connecter</Text>
        </ScrollView>   


    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E9EEF3',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 40,
      },
      button: {
        backgroundColor: '#7A8D9C',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginVertical: 10,
      },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
      },
      link: {
        marginTop: 20,
        color: '#000000',
        fontSize: 14,
      },
});