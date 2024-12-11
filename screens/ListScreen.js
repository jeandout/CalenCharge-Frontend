import {
    ScrollView,
    View, Text, StyleSheet, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";
import Charge from "../components/Charge";
import SelectAccount from "../components/SelectAccount";
import { useSelector } from 'react-redux';
import { useState } from 'react'
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
        console.log(charge)
        return <Charge key={i} navigationCharge={navigation} name={charge.name} amount={charge.amount} date={charge.date} recurrence={charge.recurrence} chargeType={charge.chargeType} priority={charge.priority} />
    })

    const accountsList = useSelector((state) => state.user.value)
    console.log('liste des charges :')
    console.log(accountsList.user)
    for (let el in accountsList.accounts ){
        console.log(el)
    }
    

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <SelectAccount />
                <ScrollView >
                    {charges}
                </ScrollView>
            </View>
            <View style={styles.bottom}>
                <Button onPress={() => navigation.navigate("NewCharge")} style={styles.addButton} accessoryLeft={addIcon} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        padding: 15,
        marginTop: 40,
     
        justifyContent:'space-between',
    },
    addButton: {
        height: 50,
        width: 50,
        
    },
    top: {
        gap:15,
    },
    bottom: {
        alignItems:'flex-end',
    },

})