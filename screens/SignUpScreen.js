import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../reducers/user";
import { Button, Text, Input, Icon } from "@ui-kitten/components";
import iconsMap from "../assets/iconsMap";

export default function SignUpScreen({ navigation }) {
    const dispatch = useDispatch();

    const [userInput, setUserInput] = useState("");
    const [visible, setVisible] = useState(false);

    function handleSubmit() {
        dispatch(addUser());
        setAccountInput("");
        navigation.navigate("TabNavigator");
    }

    const handleIconPress = (iconName) => {
        setIconInput(iconName);
        setVisible(false);
    };

    const renderIcon = (iconName, props = {}) => (
        <Icon {...props} name={iconName} style={[styles.icon, props.style]} />
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Text category='h3'>S'inscrire</Text>
            <Input
                placeholder="Nom du compte"
                onChangeText={(value) => setUserInput(value)}
                value={userInput}
            />
            <Button onPress={handleSubmit}><Text>Ajouter un compte</Text></Button>
            <Button appearance='ghost' onPress={() => navigation.goBack()}><Text>Annuler</Text></Button>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
        gap: 15,
    },
});
