import {
    ScrollView,
    View, StyleSheet, Dimensions
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Layout, Text, Select, SelectItem, IndexPath, Datepicker, Icon } from '@ui-kitten/components';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { selectAccount } from '../reducers/user';

// Icône pour le calendrier
const CalendarIcon = ({ name = 'calendar', ...props }) => (
    <Icon
        {...props}
        name={name}
    />
);

export default function RapportScreen() {
    const dispatch = useDispatch();
    // Récup des comptes et de l'index du compte sélectionné depuis le store Redux
    const accounts = useSelector((state) => state.user.value.user.accounts);
    const selectedAccountIndex = useSelector((state) => state.user.value.selectedAccount);
    // Récup du compte actuellement selectionné
    const selectedAccount = accounts[selectedAccountIndex];
    // les Etats
    const [selectedStatistic, setSelectedStatistic] = useState(new IndexPath(0));
    const [startDate, setStartDate] = useState(new Date());
    const [startMonth, setStartMonth] = useState(new Date());

    // Options pour les statistiques
    const statistic = [
        'Statistiques Mensuelles',
        'Statistiques Trimestrielles',
        'Statistiques Annuelles',
    ];
    const displayStatisticValue = statistic[selectedStatistic.row];
    const renderStatistic = (title) => <SelectItem title={title} key={title} />;


    // Données pour le BarChart de tous les comptes
    const barChartDataAllAccounts = {
        labels: accounts.map((account) => account.name),
        datasets: [
            {
                data: accounts.map((account) =>
                    account.charges.reduce((sum, charge) => sum + parseFloat(charge.amount.replace(',', '.')), 0)
                ),
            },
        ],
    };

    // Données dynamiques pour le PieChart
    const chargeTypes = [
        { name: 'Loisir', color: 'blue' },
        { name: 'Logement', color: 'green' },
        { name: 'Enfants', color: 'red' },
        { name: 'Autre', color: 'orange' },
    ];
     
    const pieChartData = chargeTypes.map((type, index) => {
        const totalCharge = selectedAccount.charges
            .filter((charge) => charge.chargeType === index)
            .reduce((sum, charge) => sum + parseFloat(charge.amount.replace(',', '.')), 0);

        return {
            name: type.name,
            charge: totalCharge,
            color: type.color,
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
        };
    });

    // Gestion du changement de compte
    const handleAccountChange = (index) => {
        dispatch(selectAccount(index.row));
    };

    return (
        <Layout style={styles.container}>
            {/* Sélecteur de compte */}
            <View style={styles.top}>
                <Select
                    selectedIndex={new IndexPath(selectedAccountIndex)}
                    value={selectedAccount.name}
                    onSelect={handleAccountChange}
                    style={styles.select}
                >
                    {accounts.map((account) => (
                        <SelectItem title={account.name} key={account.name} />
                    ))}
                </Select>
            </View>

            {/* Sélecteur de statistique */}
            <Select
                placeholder="Default"
                value={displayStatisticValue}
                selectedIndex={selectedStatistic}
                onSelect={(index) => setSelectedStatistic(index)}
                style={styles.select}
            >
                {statistic.map(renderStatistic)}
            </Select>

            {/* Champs pour les dates de début */}
            <View style={styles.dateRow}>
                <View style={styles.datePickerContainer}>
                    <Text category="label" style={styles.label}>Selectionner un mois</Text>
                    <Datepicker
                        //placeholder="Pick Date"
                        date={startDate}
                        onSelect={setStartDate}
                        //renderMonth={setStartMonth}
                        //startView= CalendarViewModes.MONTH
                        //accessoryRight={CalendarIcon}
                        style={styles.datePicker}
                    />
                </View>
                
            </View>

            {/* Graphiques */}
            <ScrollView style={styles.chartContainer}>
                <Text category="h6" style={styles.chartTitle}>Tous les Comptes</Text>
                <BarChart
                    data={barChartDataAllAccounts}
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
                <Text category="h6" style={styles.chartTitle}>Types de charges par compte Sélectionné</Text>
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
    chartTitle: {
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
});
