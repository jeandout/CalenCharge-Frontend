import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import { Button, Text, Layout, Input, Icon, IconElement } from '@ui-kitten/components';
import { useDispatch, useSelector } from "react-redux";
import { addToken, addEmail } from "../reducers/user";


export default function SignUpScreen({ navigation }) {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const dispatch = useDispatch();

    const userToken = useSelector((state) => state.user.value.user.token);

    const backend = process.env.EXPO_PUBLIC_BACKEND_ADDRESS

    const handleSubmit = async () => { //UTILISER CHECKCHARGEFIELD
        if (!newPassword || !currentPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (!userToken){
            Alert.alert('Erreur', "Vous n'êtes pas connecté");
            return;
        }
        
        const response = await fetch(`${backend}/users/change-password`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ newPassword, currentPassword }),
          })

        // const response = await fetch(`${backend}/users/change-password`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ newPassword, currentPassword }),
        // })

        const data = await response.json();

        if (data.result == false) {

            Alert.alert('Resultat', data.message);
            return;
        }

        if (data.result) {

            Alert.alert('Succès', data.message, [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
        }

    };

    const toggleSecureEntry = () => {
        setShowPassword(!showPassword);
    };
    const toggleSecureEntryNew = () => {
        setShowNewPassword(!showNewPassword);
    };

    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon
                {...props}
                name={showPassword ? 'eye-off' : 'eye'}
            />
        </TouchableWithoutFeedback>
    );
    const renderIconNew = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntryNew}>
            <Icon
                {...props}
                name={showNewPassword ? 'eye-off' : 'eye'}
            />
        </TouchableWithoutFeedback>
    );

    return (
        <Layout style={styles.container}>
                            <Text category='h3' style={{ textAlign: 'center' }}>Modification de mot de passe</Text>

            <View style={{ gap: 20, }}>

                <Input
                    label='Ancien mot de passe'
                    placeholder="Mot de passe"
                    accessoryRight={renderIcon}
                    secureTextEntry={showPassword}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    autoCapitalize="none"
                />

                <Input
                    label='Nouveau mot de passe'
                    placeholder="Mot de passe"
                    accessoryRight={renderIconNew}
                    secureTextEntry={showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCapitalize="none"
                />
            </View>
            <View style={{ gap: 10, }}>
                <Button  onPress={handleSubmit}>
                    <Text>Valider</Text>
                </Button>
                <Button  appearance='ghost' onPress={() => navigation.goBack()}>
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
        justifyContent: 'space-between',
    },
    iconContainer: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

