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
                    account.charges.reduce((sum, charge) => sum + parseFloat(charge.amount.toString().replace(',', '.')), 0)
                ),
            },
        ],
    };

    // Fonction pour filtrer les données du BarChart en fonction de la vue sélectionnée
    const getFilteredBarChartData = () => {
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
    
        // Filtrer les données pour chaque compte
        const filteredData = accounts.map((account) => {
            const charges = account.charges.flatMap((charge) => {
                const chargeDate = new Date(charge.date);
                const isRecurringForMonth = charge.recurrenceList?.includes(selectedMonth);
    
                switch (selectedStatistic.row) {
                    case 0: // Vue mensuelle
                        if (
                            (chargeDate.getFullYear() === selectedYear &&
                                chargeDate.getMonth() === selectedMonth) ||
                            isRecurringForMonth
                        ) {
                            return [charge]; // Inclure une seule occurrence pour ce mois
                        }
                        break;
    
                    case 1: // Vue annuelle
                        if (chargeDate.getFullYear() === selectedYear || charge.recurrenceList) {
                            // Répéter les charges en fonction de leur récurrence
                            const recurrenceCount =
                                charge.recurrence === 0 ? 12 : // Mensuel
                                charge.recurrence === 1 ? 4 : // Trimestriel
                                charge.recurrence === 2 ? 1 : // Annuel
                                0;
    
                            return Array(recurrenceCount).fill(charge); // Répliquer les occurrences
                        }
                        break;
    
                    default:
                        return [];
                }
    
                return [];
            });
    
            // Somme des montants filtrés pour ce compte
            return charges.reduce((sum, charge) => {
                const amount = parseFloat(charge.amount.toString().replace(',', '.'));
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);
        });
    
        // Retourner les données formatées pour le BarChart
        return {
            ...barChartDataAllAccounts, // Inclure les labels des comptes
            datasets: [{ data: filteredData }],
        };
    };

   // Filtrer les charges en fonction du type de statistique (en incluant les récurrences)
   const filteredPieChartData = chargeTypes.map((type, index) => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    const charges = selectedAccount.charges.filter((charge) => {
        const chargeDate = new Date(charge.date);
        const chargeTypeMatches = charge.chargeType === index;

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
        (sum, charge) => sum + parseFloat(charge.amount.toString().replace(',', '.')),
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

    // Fonction pour calculer les charges passées et leurs montants
    const getFilteredCharges = () => {
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
    
        const charges = selectedAccount.charges.flatMap((charge) => {
            const chargeDate = new Date(charge.date);
            const isRecurringForMonth = charge.recurrenceList?.includes(selectedMonth);
    
            switch (selectedStatistic.row) {
                case 0: // Vue Mensuelle
                    if (
                        (chargeDate.getFullYear() === selectedYear &&
                            chargeDate.getMonth() === selectedMonth) ||
                        isRecurringForMonth
                    ) {
                        return [charge]; // Une seule instance pour le mois sélectionné
                    }
                    break;
    
                case 1: // Vue Annuelle
                    if (chargeDate.getFullYear() === selectedYear || charge.recurrenceList) {
                        // Répéter les charges récurrentes en fonction de leur fréquence
                        const recurrenceCount =
                            charge.recurrence === 0 ? 12 : // Mensuel : 12 occurrences
                            charge.recurrence === 1 ? 4 : // Trimestriel : 4 occurrences
                            charge.recurrence === 2 ? 1 : // Annuel : 1 occurrence
                            0; // Aucun cas correspondant
    
                        return Array(recurrenceCount).fill(charge); // Répliquer la charge selon la récurrence
                    }
                    break;
    
                default:
                    return [];
            }
    
            return [];
        });
    
        return charges;
    };
    
    // Charges du mois ou de l'année sélectionnés

    const currentCharges = getFilteredCharges();
    
    // Nombre de charges passées 
    const currentDate = new Date();
    const pastCharges = currentCharges.filter((charge) => {
        const chargeDate = new Date(charge.date);
        return chargeDate < currentDate; 
    });
    
    // Somme totale des charges 
    const totalChargesSum = currentCharges.reduce((sum, charge) => {
        const amount = parseFloat(charge.amount.toString().replace(',', '.'));
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0).toFixed(2);
    
    // Somme des charges passées 
    const pastChargesSum = pastCharges.reduce((sum, charge) => {
        const amount = parseFloat(charge.amount.toString().replace(',', '.'));
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0).toFixed(2);


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
           

            <ScrollView style={styles.chartContainer}>
                 {/* Informations sur les charges */}
            <View>
            <Text category="h6" style={styles.compteTitle}>
                    Nombre et Montant des charges
                </Text>
                <Text style={styles.chartTitle}>
                    Nombre des Charges passées : {pastCharges.length} / {currentCharges.length}
                </Text>
                <Text style={styles.chartTitle}>
                    Montant des charges prélevées : {pastChargesSum}€ / {totalChargesSum}€
                </Text>
            </View>
                <Text category="h6" style={styles.compteTitle}>
                    Types de charges par compte sélectionné
                </Text>
                        {/* Graphiques */}
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
                    data={getFilteredBarChartData()} 
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