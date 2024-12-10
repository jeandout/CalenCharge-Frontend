import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";
import Charge from "../components/Charge";
import SelectAccount from "../components/SelectAccount";
import {useSelector} from 'react-redux';
import {useState} from 'react'
import { Button, Icon, IconElement, List, ListItem } from '@ui-kitten/components';


export default function ListScreen({navigation}){

    //const user = useSelector((state) => state.user.value.user);

    const accounts = useSelector((state) => state.user.value.user.accounts);
    const selectedAccount = useSelector((state) => state.user.value.selectedAccount);

    //const accountObj = user.accounts.find(account=>account.name===selectedAccount);
let charges;
console.log(accounts[selectedAccount])
/*if (accounts[selectedAccount].charges.length > 0){
   charges = accounts[selectedAccount].charges?.map((charge, i)=>{
        console.log(charge)
       return <Charge key={i} name={charge.name}/>
    })}*/

    //amount={charge.amount} date={charge.date} priority={charge.priority}

    //Changer icone pour un PLUS

    return(
        <View style={styles.container}>
            <View> 
            <SelectAccount />
            </View>
           
           <View >{charges}</View>
           <TouchableOpacity onPress={() => navigation.navigate("NewCharge")}> 
        <Text>Ajouter une Charge</Text>
      </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#ffffff"
    },
})