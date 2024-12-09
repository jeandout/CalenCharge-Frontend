import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";
import Charge from "../components/Charge";
import {useSelector} from 'react';


export default function ChargesScreen(){

    const user = useSelector((state) => state.user.value);

    const charges = user.accounts.charges.map((charge, i)=>{
        return <Charge name={charge.name} amount={charge.amount} date={charge.date} priority={charge.priority}/>
    })


    return(
        <View style={styles.container}>
           {charges}
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