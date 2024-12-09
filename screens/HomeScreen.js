import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";


export default function HomeScreen({navigation}){
    return(
        <View style={styles.container}>
            <Text>HomeScreen</Text>
            <TouchableOpacity onPress={() => navigation.navigate("TabNavigator")}>
                <Text>Go to Calendar</Text>
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