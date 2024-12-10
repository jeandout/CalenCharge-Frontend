import { ScrollView,
    View, Text, StyleSheet, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";
import Charge from "../components/Charge";
import SelectAccount from "../components/SelectAccount";
import { useSelector } from 'react-redux';
import { useState } from 'react'
import { Button, Icon, IconElement, List, ListItem } from '@ui-kitten/components';


export default function ListScreen({ navigation }) {

    const accounts = useSelector((state) => state.user.value.user.accounts);
    const selectedAccount = useSelector((state) => state.user.value.selectedAccount);

    const charges = accounts[selectedAccount].charges?.map((charge, i) => {
        console.log(charge)
        return <Charge key={i} navigationCharge={navigation} name={charge.name} amount={charge.amount} date={charge.date} recurrence={charge.recurrence} chargeType={charge.chargeType} priority={charge.priority} />
    })

    //Changer icone pour un PLUS

    return (
        <View style={styles.container}>
            <SelectAccount />
            <ScrollView >
                {charges}
            </ScrollView>
            <Button onPress={() => navigation.navigate("NewCharge")}>
                <Text>Ajouter une Charge</Text>
            </Button>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        padding: 15,
    },
   
})