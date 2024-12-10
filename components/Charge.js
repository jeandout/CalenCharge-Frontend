import {
    View, StyleSheet, TouchableOpacity, Image, TextInput,
    KeyboardAvoidingView, Platform
} from "react-native";
import { Button, Card, Layout, Text, Icon, useTheme } from '@ui-kitten/components';

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
    const theme = useTheme();

    const priorityDisplay = () => {
        if (props.priority) {
            return (<Icon fill={theme['color-warning-500']} name='alert-triangle-outline' style={{ marginLeft: 10, height: 20 }} />)
        }
    }

    const day = new Date(props.date).getDate();

    const recurrence = () => {
        if (props.recurrence == 1) {
            return ('chaque mois')
        } else if (props.recurrence == 2) {
            return ('chaque trimestre')
        } else if (props.recurrence == 3) {
            return ('chaque année')
        }
    };

    const payDay = () => {
        if (props.recurrence == 0) {
            return (
                `Chaque semaine`
            )
        } else {
            return (
                `${day} de ${recurrence()}`
            )
        }
    }


    return (

        <View style={styles.card}>
            <View style={styles.infos}>
                <Text category='h6' >
                    {props.name}{priorityDisplay()}
                    {/* <Icon name='alert-triangle-outline'/> */}
                </Text>
                <Text category='s1'>
                    {payDay()}
                </Text>
            </View>
            <View style={styles.right}>
                <Text category='s2' style={styles.amount}>{props.amount}€</Text>
                <View style={styles.actions} onPress={() => props.navigationCharge.navigate('UpdateCharge', { props })} >
                    <Icon onPress={() => props.navigationCharge.navigate('UpdateCharge', { props })} name='edit-outline' fill={theme['color-primary-500']} />
                </View>
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
        marginBottom: 10,
        alignItems: 'center',

    },
    infos: {

    },
    right:{
        flexDirection:'row',
        gap:20,
        alignItems:'center',
    },
    amount: {
        fontSize: 24,
        fontWeight: 900,
        textAlign: 'left',
    },
    actions: {
        maxHeight: 30,
    }
})