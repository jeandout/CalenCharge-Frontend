import {
    ScrollView,
    View, StyleSheet, Image, TextInput,
    KeyboardAvoidingView, Platform, Dimensions
} from "react-native";
import SelectAccount from "../components/SelectAccount";
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Layout, Text, Input, Select, SelectItem, IndexPath, Datepicker, Icon, Button } from '@ui-kitten/components';
import { BarChart, PieChart } from 'react-native-chart-kit'; 

// Icône pour le bouton ajout
const addIcon = ({ name = 'plus-outline', ...props }) => (
    <Icon
        {...props}
        name={name}
        fill={'white'}
    />
);

// Icône pour le calendrier
const CalendarIcon = ({ name = 'calendar', ...props }) => (
    <Icon
        {...props}
        name={name}
    />
);

export default function RapportScreen() {
    const accounts = useSelector((state) => state.user.value.user.accounts);
    const selectedAccount = useSelector((state) => state.user.value.selectedAccount);
    const [selectedStatistic, setSelectedStatistic] = useState(new IndexPath(0));
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // Variables pour l'affichage du composant Select pour la statistique
    const statistic = [
        'Statistiques Mensuelles',
        'Statistiques Trimestrielles',
        'Statistiques Annuelles',
    ];
    const displayStatisticValue = statistic[selectedStatistic.row];
    const renderStatistic = (title) => (
        <SelectItem title={title} key={title} />
    );

    // données fictives pour le diagramme
  const barChartData = {
    labels: [ 'Compte1', 'Compte2', 'Compte3', 'Compte4'],
    datasets: [
        {
            data:[750, 520, 900, 360],
        },
    ],
  };
   // données fictives pour le camembert 

   const pieChartData =[
    {name :'Loisir', charge: 150, color: 'blue', legendFontColor:'#7F7F7F', legendFontSize: 12},
    {name :'Logement', charge: 850, color: 'green', legendFontColor:'#7F7F7F', legendFontSize: 12},
    {name :'Enfants', charge: 300, color: 'red', legendFontColor:'#7F7F7F', legendFontSize: 12},
    {name :'Autre', charge: 200, color: 'orange', legendFontColor:'#7F7F7F', legendFontSize: 12}
   ]
    
    return (
        <Layout style={styles.container}>
            {/* Selecteur de compte */}
            <View style={styles.top}>
                <SelectAccount />
            </View>

            {/* Sélecteur de statistique */}
            <Select
                placeholder="Default"
                value={displayStatisticValue}
                selectedIndex={selectedStatistic}
                onSelect={index => setSelectedStatistic(index)}
                style={styles.select}
            >
                {statistic.map(renderStatistic)}
            </Select>

            {/* Champs pour les dates de début et de fin */}
            <View style={styles.dateRow}>
                <View style={styles.datePickerContainer}>
                    <Text category="label" style={styles.label}>Début</Text>
                    <Datepicker
                        placeholder="Pick Date"
                        date={startDate}
                        onSelect={setStartDate}
                        accessoryRight={CalendarIcon}
                        style={styles.datePicker}
                    />
                </View>
                <View style={styles.datePickerContainer}>
                    <Text category="label" style={styles.label}>Fin</Text>
                    <Datepicker
                        placeholder="Pick Date"
                        date={endDate}
                        onSelect={setEndDate}
                        accessoryRight={CalendarIcon}
                        style={styles.datePicker}
                        
                    />
                </View>
            </View>
            {/*graphiques*/}
           <ScrollView style={styles.chartContainer}>
               <BarChart
               data={barChartData}
               width={Dimensions.get('window').width - 30}
               height={220}
               chartConfig={{
                   backgroundColor: '#f7f9fc',
                   backgroundGradientFrom: '#ffffff',
                   backgroundGradientTo: '#ffffff',
                   decimalPlaces: 0,
                   color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                   style: {
                       borderRadius: 16,
                   },
               }}
               style={styles.chart}
               fromZero
               />
               <PieChart
                    data={pieChartData}
                    width={Dimensions.get('window').width - 30}
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    }}
                    accessor="charge"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    style={styles.chart}
                />
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        padding: 15,
        marginTop: 40,
        justifyContent: 'space-between',
    },
    top: {
        gap: 15,
    },
    select: {
        marginVertical: 10,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    datePickerContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    datePicker: {
        borderRadius: 5,
    },
    chart: {
        marginVertical: 10,
        borderRadius: 8,
    },
    chartContainer: {
        marginTop: 20,
    },
});