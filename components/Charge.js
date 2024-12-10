import {
    View, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";
import { Button, Card, Layout, Text, Icon } from '@ui-kitten/components';

const editIcon = ({ name = 'edit-outline', ...props }) => (
    <Icon
        {...props}
        name={name}
    />
);

const alertIcon = ({ name = 'alert-triangle-outline', ...props }) => (
    <Icon
        {...props}
        name={name}
    />
);


export default function Charge(props) {
    console.log(props.priority)

    const edit = () => {

    }
    const priorityDisplay = () => {
        if (props.priority) {
            return( <Icon name='alert-triangle-outline' style={{marginRight:10, height:15}}/>   )
        }
    }

    return (

        <View style={styles.card}>
            <View style={styles.infos}>
                <Text category='h6'>
                {priorityDisplay()}{props.name}
                    {/* <Icon name='alert-triangle-outline'/> */}
                </Text>
                <Text category='s1'>
                    {props.date}
                </Text>
            </View>
            <Text category='h4'>{props.amount}€</Text>
            <View style={styles.actions}>
                <Button onPress={() => edit()} accessoryLeft={editIcon} appearance='ghost' />
            </View>
        </View>


    )
}
const styles = StyleSheet.create({
    card: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'space-between',
        marginBottom:10,
        alignItems:'center',

    },
    infos: {

    },
    amount: {

    }
})