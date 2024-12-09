import {
    View, Text, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";
import { Button, } from '@ui-kitten/components';


export default function ChargesScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text>ChargesScreen</Text>
            <Button onPress={() => navigation.navigate("AddChargeScreen")}>
                BUTTON
            </Button>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "brown"
    },
})