import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";


export default function Charge(props){
    return(
        <View style={styles.container}>
            <View style={styles.chargeDescription}>
            <View style={styles.chargeTitle}>
            <Text>{props.name}</Text>
            <Text>Logo Important ?</Text>
            </View>
            <Text>Tous les XXX</Text>
            </View>
            <Text>XXX€</Text>
            <Text>Logo Modifier</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        flex:0.1,
        width:'90%',
        borderRadius:3,
        margin:'1%',
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"white"
    },
    chargeDescription:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
    },
    chargeTitle:{
        flexDirection:"row",
        justifyContent:'space-between'
    }
})