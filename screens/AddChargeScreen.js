import React from 'react';
import { StyleSheet, View } from "react-native";
import { Layout, Text, Input, Select, SelectItem, IndexPath, Datepicker, Icon, IconElement, Toggle, Button, } from '@ui-kitten/components';

const CalendarIcon = (props) => (
    <Icon
        {...props}
        name='calendar'
    />
);



export default function AddChargeScreen() {

    const [name, setName] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [selectedRecurrence, setSelectedRecurrence] = React.useState();
    const [selectedChargeType, setSelectedChargeType] = React.useState();

    const [date, setDate] = React.useState(new Date());

    const [checked, setChecked] = React.useState(false);
    const onCheckedChange = (isChecked): void => {
        setChecked(isChecked);
    };


    return (
        <Layout
            style={styles.container}
            level='1'
        >
            <Text style={styles.text} category='h1'>Ajouter une nouvelle charge</Text>

            <Input
                placeholder='Nom'
                value={name}
                onChangeText={nextValue => setName(nextValue)}
            />
            <Select
                placeholder='Type de charge'
                selectedIndex={selectedChargeType}
                onSelect={index => setSelectedChargeType(index)}
            >
                <SelectItem title='Loisir' />
                <SelectItem title='Logement' />
                <SelectItem title='Enfants' />
                <SelectItem title='Autre' />
            </Select>
            <Select
                status='Récurence'
                placeholder='Récurence'
                selectedIndex={selectedRecurrence}
                onSelect={index => setSelectedRecurrence(index)}
            >
                <SelectItem title='Hebdomadaire'/>
                <SelectItem title='Mensuelle' />
                <SelectItem title='Trimestrielle' />
                <SelectItem title='Semestrielle' />
            </Select>
            <Datepicker
                // label='Label'
                // caption='Caption'
                placeholder='Pick Date'
                date={date}
                onSelect={nextDate => setDate(nextDate)}
                accessoryRight={CalendarIcon}
            />
            <View style={styles.row}>
                <Text style={styles.text} category='p1'>Prioritaire</Text>
                <Toggle
                    checked={checked}
                    onChange={onCheckedChange}
                />
            </View>
            <Input
                placeholder='Montant'
                value={amount}
                onChangeText={nextValue => setAmount(nextValue)}
            />
            <Button onPress={() => navigation.navigate("AddChargeScreen")}>
                Ajouter
            </Button>


        </Layout>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        padding: 15,
        // Organisation horizontal
        // alignItems: "center",
        // Oganisation verticale
        // justifyContent: "center", 

    },
    row: {
        flexDirection:'row',
        alignItems: "center",
        justifyContent: "space-between", 
      
    }
});