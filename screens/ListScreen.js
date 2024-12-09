import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";
import Charge from "../components/Charge";
import {useSelector} from 'react-redux';
import {useState} from 'react'

export default function ListScreen({navigation}){

    const user = useSelector((state) => state.user.value);

    const [selectedAccount, setSelectedAccount] = useState('Test'); //Changer quand on aura le déroulant

    const accountObj = user.accounts.find(account=>account.name===selectedAccount);

    const charges = accountObj.charges?.map((charge, i)=>{
        console.log(charge)
       return <Charge key={i} name={charge.name}/>
    })

    //amount={charge.amount} date={charge.date} priority={charge.priority}

    //Changer icone pour un PLUS

    return(
        <View style={styles.container}>
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
        backgroundColor:"brown"
    },
})