import {
    ScrollView,
    View, Text, StyleSheet, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";
import Charge from "../components/Charge";
import SelectAccount from "../components/SelectAccount";
import { useSelector } from 'react-redux';
import { useEffect } from 'react'
import { Button, Icon, IconElement, List, ListItem, } from '@ui-kitten/components';

const addIcon = ({ name = 'plus-outline', ...props }) => (
    <Icon
        {...props}
        name={name}
        fill={'white'}
    />
);


export default function ListScreen({ navigation }) {

    const accounts = useSelector((state) => state.user.value.user.accounts);
    const selectedAccount = useSelector((state) => state.user.value.selectedAccount);

    const charges = accounts[selectedAccount].charges?.map((charge, i) => {
        return <Charge key={i} navigationCharge={navigation} name={charge.name} amount={charge.amount} date={charge.date} recurrence={charge.recurrence} chargeType={charge.chargeType} priority={charge.priority} />
    })

      const userToken = useSelector((state) => state.user.value.user.token);

  useEffect(() => {
    if (userToken === '') {
        navigation.replace('LoginScreen', { redirected: true });
    }
}, [userToken, navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <SelectAccount />
                <ScrollView >
                    {charges}
                </ScrollView>
            </View>
            <Button onPress={() => navigation.navigate("NewCharge")} style={styles.addButton} accessoryLeft={addIcon} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        padding: 15,
        paddingTop: 55,
        justifyContent: 'space-between',
        backgroundColor: '#F6FDF1',
    },
    addButton: {
        position: 'absolute',
        height: 50,
        width: 50,
        bottom: 20, // Position en bas
        right: 20,
        zIndex: 30,
    },
    top: {
        gap: 15,
        flex: 1,
        zIndex: 20,
    },
    bottom: {
        // alignItems:'flex-end',

    },

})