import {
    ScrollView,
    View, StyleSheet, Dimensions
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Layout, Text, Select, SelectItem, IndexPath, Datepicker, Icon } from '@ui-kitten/components';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { selectAccount } from '../reducers/user';
import SelectAccount from "../components/SelectAccount";


// Icône pour le calendrier
const CalendarIcon = ({ name = 'calendar', ...props }) => (
    <Icon
        {...props}
        name={name}
    />
);

export default function RapportScreen() {
    const dispatch = useDispatch();
    const accounts = useSelector((state) => state.user.value.user.accounts);
    const selectedAccountIndex = useSelector((state) => state.user.value.selectedAccount);
    const selectedAccount = accounts[selectedAccountIndex];

    // États
    const [selectedStatistic, setSelectedStatistic] = useState(new IndexPath(0)); // Par défaut : Mensuelles
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Options pour les statistiques
    const statistic = [
        'Vue Mensuelle',
        'Vue Annuelle',
    ];
    const displayStatisticValue = statistic[selectedStatistic.row];
    const renderStatistic = (title) => <SelectItem title={title} key={title} />;

    // Types de charges
    const chargeTypes = [
        { name: 'Loisir', color: '#D8EFD3' },
        { name: 'Logement', color: '#55AD9B' },
        { name: 'Enfants', color: '#FFB7AA' },
        { name: 'Autre', color: '#979797' },
    ];

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

   // Filtrer les charges en fonction du type de statistique (en incluant les récurrences)
const filteredPieChartData = chargeTypes.map((type, index) => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const charges = selectedAccount.charges.filter((charge) => {
        const chargeDate = new Date(charge.date);
        const chargeTypeMatches = charge.chargeType === index;

        // Vérifier si la charge est récurrente pour le mois sélectionné
        const isRecurringForMonth = charge.recurrenceList?.includes(selectedMonth);

        switch (selectedStatistic.row) {
            case 0: // Mensuelles
                return (
                    (chargeDate.getFullYear() === selectedYear &&
                        chargeDate.getMonth() === selectedMonth) ||
                    isRecurringForMonth
                ) && chargeTypeMatches;


            case 1: // Annuelles
                return (
                    chargeDate.getFullYear() === selectedYear || charge.recurrenceList
                ) && chargeTypeMatches;

            default:
                return false;
        }
    });

    const totalCharge = charges.reduce(
        (sum, charge) => sum + parseFloat(charge.amount.replace(',', '.')),
        0
    );

    return {
        name: type.name,
        charge: totalCharge,
        color: type.color,
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    };
});

    // Charges du mois en cours
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonthCharges = selectedAccount.charges.filter((charge) => {
        const chargeDate = new Date(charge.date);
        const isRecurring = charge.recurrenceList?.includes(currentMonth);
        return (
            (chargeDate.getFullYear() === currentYear && chargeDate.getMonth() === currentMonth) ||
            isRecurring
        );
    });

    // Charges passées
    const pastCharges = currentMonthCharges.filter((charge) => {
        const chargeDate = new Date(charge.date);
        return chargeDate < currentDate;
    });

    // Somme totale des charges du mois en cours
    const totalChargesSum = currentMonthCharges.reduce(
        (sum, charge) => sum + parseFloat(charge.amount.replace(',', '.')),
        0
    );

    // Somme des charges passées
    const pastChargesSum = pastCharges.reduce(
        (sum, charge) => sum + parseFloat(charge.amount.replace(',', '.')),
        0
    );

    // Gestion du changement de compte
    const handleAccountChange = (index) => {
        dispatch(selectAccount(index.row));
    };

    return (
        <Layout style={styles.container}>
            {/* Sélecteur de compte */}
            <View style={styles.top}>
            <SelectAccount />
            </View>

            {/* Informations sur les charges */}
            <View>
                <Text style={styles.chartTitle}>
                    Charges passées du mois en cours : {pastCharges.length} / {currentMonthCharges.length}
                </Text>
                <Text style={styles.chartTitle}>
                    Montant des charges prélevées : {pastChargesSum}€ / {totalChargesSum}€
                </Text>
            </View>

            <Text style={styles.text} category='h6'>Selectionner la période à afficher </Text>

            <View style={styles.dateRow}>
            {/* Sélecteur de statistique */}
            <View style={styles.stat}> 
            <Select
                placeholder="Default"
                value={displayStatisticValue}
                selectedIndex={selectedStatistic}
                onSelect={(index) => setSelectedStatistic(index)}
                style={styles.select}
            >
                {statistic.map(renderStatistic)}
            </Select>
            </View>

            {/* Sélecteur de mois et année */}
            <View style={styles.dateStat}> 
                <Datepicker
                    date={selectedDate}
                    onSelect={(nextDate) => setSelectedDate(nextDate)}
                    accessoryRight={CalendarIcon}
                    style={styles.datePicker}
                    min={new Date(1970, 0, 1)} // affichage min
                    max={new Date(2050, 11, 31)} // affichage max
                />
            </View> 
            </View>

            {/* Graphiques */}
            <ScrollView style={styles.chartContainer}>
                <Text category="h6" style={styles.chartTitle}>
                    Types de charges par compte sélectionné
                </Text>
                <PieChart
                    data={filteredPieChartData}
                    width={Dimensions.get('window').width - 30}
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    }}
                    accessor="charge"
                    backgroundColor="#F6FDF1"
                    paddingLeft="15"
                    style={styles.chart}
                />

                <Text category="h6" style={styles.compteTitle}>
                    Vue sur tous les comptes
                </Text>
                <BarChart
                    data={barChartDataAllAccounts}
                    width={Dimensions.get('window').width - 30}
                    height={220}
                    chartConfig={{
                        backgroundColor: '##F6FDF1',
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
        textAlign: 'left',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    compteTitle:{
        textAlign: 'center',
        marginBottom: 10,
        paddingBlock: 10,
        fontWeight: 'bold',
        backgroundColor: '#ffffff'
    },
    stat:{
        flex: 3, 
    },
    dateStat:{
        flex: 3, 
    },
    text: {
        textAlign: 'center', 
        textDecorationStyle: 'bold'
    },
});
