import {
    ScrollView,
    View, StyleSheet, Dimensions
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Layout, Text, Select, SelectItem, IndexPath, Datepicker, Icon } from '@ui-kitten/components';
import { BarChart, PieChart } from 'react-native-chart-kit';
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
                const chargeStartYear = chargeDate.getFullYear();
                const chargeStartMonth = chargeDate.getMonth();
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
                        if (chargeStartYear <= selectedYear && charge.recurrenceList) {
                            // Calculer les occurrences dans l'année sélectionnée
                            let recurrenceCount = 0;

                            if (charge.recurrence === 0) {
                                // Mensuel
                                recurrenceCount = Math.max(
                                    0,
                                    12 - (chargeStartYear < selectedYear
                                        ? 0
                                        : chargeStartMonth)
                                );
                            } else if (charge.recurrence === 1) {
                                // Trimestriel
                                for (const month of charge.recurrenceList) {
                                    if (
                                        month >= (chargeStartYear < selectedYear
                                            ? 0
                                            : chargeStartMonth) &&
                                        month < 12
                                    ) {
                                        recurrenceCount++;
                                    }
                                }
                            } else if (charge.recurrence === 2) {
                                // Annuel
                                recurrenceCount =
                                    chargeStartYear === selectedYear ? 1 : 0;
                            }

                            // Répliquer les occurrences pour cette année
                            return Array(recurrenceCount).fill(charge);
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

    // Filtrer les charges en fonction du type de statistique 
    const filteredPieChartData = chargeTypes.map((type, index) => {
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();

        const charges = selectedAccount.charges.flatMap((charge) => {
            const chargeDate = new Date(charge.date);
            const chargeTypeMatches = charge.chargeType === index;
            const chargeStartYear = chargeDate.getFullYear();
            const chargeStartMonth = chargeDate.getMonth();

            if (!chargeTypeMatches) return [];

            switch (selectedStatistic.row) {
                case 0: // Vue Mensuelle
                    if (
                        (chargeDate.getFullYear() === selectedYear &&
                            chargeDate.getMonth() === selectedMonth) ||
                        (charge.recurrenceList?.includes(selectedMonth) &&
                            chargeStartYear <= selectedYear)
                    ) {
                        return [charge]; // Une seule occurrence pour le mois sélectionné
                    }
                    break;

                case 1: // Vue Annuelle
                    if (chargeStartYear <= selectedYear && charge.recurrenceList) {
                        const occurrences = [];

                        if (charge.recurrence === 0) {
                            // Mensuel : Ajouter les mois restants dans l'année sélectionnée
                            for (
                                let month = chargeStartYear < selectedYear
                                    ? 0
                                    : chargeStartMonth;
                                month < 12;
                                month++
                            ) {
                                if (charge.recurrenceList.includes(month)) {
                                    occurrences.push(charge);
                                }
                            }
                        } else if (charge.recurrence === 1) {
                            // Trimestriel : Ajouter les trimestres restants dans l'année sélectionnée
                            for (
                                let month = chargeStartYear < selectedYear
                                    ? 0
                                    : chargeStartMonth;
                                month < 12;
                                month += 3
                            ) {
                                if (charge.recurrenceList.includes(month)) {
                                    occurrences.push(charge);
                                }
                            }
                        } else if (charge.recurrence === 2) {
                            // Annuel : Ajouter une occurrence si l'année correspond
                            if (chargeStartYear === selectedYear) {
                                occurrences.push(charge);
                            }
                        }

                        return occurrences;
                    }
                    break;

                default:
                    return [];
            }

            return [];
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
            const chargeStartYear = chargeDate.getFullYear();
            const chargeStartMonth = chargeDate.getMonth();

            switch (selectedStatistic.row) {
                case 0: // Vue Mensuelle
                    if (
                        (chargeDate.getFullYear() === selectedYear &&
                            chargeDate.getMonth() === selectedMonth) ||
                        (charge.recurrenceList?.includes(selectedMonth) &&
                            chargeStartYear <= selectedYear)
                    ) {
                        return [charge]; // Une seule occurrence pour le mois sélectionné
                    }
                    break;

                case 1: // Vue Annuelle
                    if (chargeStartYear <= selectedYear && charge.recurrenceList) {
                        const occurrences = [];

                        if (charge.recurrence === 0) {
                            // Mensuel : Ajouter les mois restants dans l'année sélectionnée
                            for (
                                let month = chargeStartYear < selectedYear
                                    ? 0
                                    : chargeStartMonth;
                                month < 12;
                                month++
                            ) {
                                if (charge.recurrenceList.includes(month)) {
                                    occurrences.push(charge);
                                }
                            }
                        } else if (charge.recurrence === 1) {
                            // Trimestriel : Ajouter les trimestres restants dans l'année sélectionnée
                            for (
                                let month = chargeStartYear < selectedYear
                                    ? 0
                                    : chargeStartMonth;
                                month < 12;
                                month += 3
                            ) {
                                if (charge.recurrenceList.includes(month)) {
                                    occurrences.push(charge);
                                }
                            }
                        } else if (charge.recurrence === 2) {
                            // Annuel : Ajouter une occurrence si l'année correspond
                            if (chargeStartYear === selectedYear) {
                                occurrences.push(charge);
                            }
                        }

                        return occurrences;
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


    return (
        <Layout style={styles.container}>
            {/* Sélecteur de compte */}
            <SelectAccount />
            <View style={styles.dateRow}>
                {/* Sélecteur de statistique */}
                <Select
                    style={{ flex: 1 }}
                    placeholder="Default"
                    value={displayStatisticValue}
                    selectedIndex={selectedStatistic}
                    onSelect={(index) => setSelectedStatistic(index)}
                >
                    {statistic.map(renderStatistic)}
                </Select>
                {/* Sélecteur de mois et année */}
                <Datepicker
                    style={{ flex: 1 }}
                    date={selectedDate}
                    onSelect={(nextDate) => setSelectedDate(nextDate)}
                    accessoryRight={CalendarIcon}
                    min={new Date(1970, 0, 1)} // affichage min
                    max={new Date(2050, 11, 31)} // affichage max
                />
            </View>


            <ScrollView style={styles.chartContainer}>
                {/* Informations sur les charges */}
                <View style={styles.infos}>
                    <View style={styles.stats}>
                        <Text category='s1' style={styles.chartTitle}>
                            Charges passées : 
                        </Text>
                    </View>
                    <View style={styles.stats}>
                        <Text category='s1' style={{fontWeight:900,}} >
                            {pastCharges.length} / {currentCharges.length}
                        </Text>
                    </View>
                </View>
                <View style={styles.infos}>
                    <View style={styles.stats}>
                        <Text category='s1' style={styles.chartTitle}>
                            Montants prélevés : 
                        </Text>
                    </View>
                    <View style={styles.stats}>
                        <Text category='s1' style={{fontWeight:900,}}>
                            {pastChargesSum}€ / {totalChargesSum}€
                        </Text>
                    </View>
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
                        backgroundColor: '#F6FDF1',
                        backgroundGradientFrom: '#F6FDF1',
                        backgroundGradientTo: '#F6FDF1',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(151, 151, 151, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(151, 151, 151, ${opacity})`,
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 15,
        padding: 15,
        paddingTop: 55,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
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
        marginTop: 0,
    },
    chartTitle: {
        textAlign: 'right',
    },
    compteTitle: {
        marginTop: 15,
        marginBottom: 10,
        paddingBlock: 10,
        backgroundColor: '#ffffff'
    },
    text: {
        textAlign: 'center',
        textDecorationStyle: 'bold'
    },
    stats: {
        flex: 1,
        gap:15,
    },
    infos:{
        flexDirection: 'row',
        gap:5,
        alignItems:'flex-end',
    },
});
