import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native'
import { Button, Layout, Text } from '@ui-kitten/components'
import { useDispatch, useSelector } from "react-redux";
import { addToken } from "../reducers/user";

//utiliser navigation.canGoBack ? pour afficher une alerte si on a été redirigé

export default function LoginScreen({ route, navigation }) {

  const userToken = useSelector((state) => state.user.value.user.token);

  console.log(userToken)

  if (userToken !== '') {
    navigation.replace('TabNavigator')
  }

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const { redirected } = route.params || {};
      if (redirected) {
        Alert.alert("Votre session a expiré, veuillez vous reconnecter.");
      }
    });

    return unsubscribe; // Nettoyer l'écouteur à la désactivation de l'écran
  }, [navigation, route]);

  return (
    <Layout level={'1'} style={styles.container}>
      <View style={styles.brand}>
        <Image resizeMode="contain" style={styles.logo} source={require('../assets/calencharge.png')} />
        <Text category='h3'>Le CalenCharge</Text>
      </View>
      <View style={styles.actions}>
        <Button onPress={() => navigation.replace('SignInScreen')}>
          <Text >Se connecter</Text>
        </Button>
        <Button status='info' onPress={() => navigation.replace('SignUpScreen')}>
          <Text >S'inscrire</Text>
        </Button>
        <Button appearance='ghost' onPress={() => { dispatch(addToken(null)); navigation.replace('TabNavigator') }}>
          <Text >Continuer sans se connecter</Text>
        </Button>
      </View>
    </Layout>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 55,
    alignItems: 'center',
  },
  brand: {
    flex: 1,
    gap:30,
    justifyContent: 'center',
    alignItems:'center',
  },
  actions: {
    padding: 30,
    gap: 20,
    flex: 1,
    justifyContent: 'center',
    width: "100%",
  },
  logo: {
    width: 120,
    maxHeight:120,
    alignItems:'center',
  },
});